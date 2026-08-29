import JSZip from 'jszip';
import { Product, ZipImportPreview, ZipImportResult } from '../types';

export type { ZipImportResult };

export class ZipService {
  /**
   * Reads a ZIP file and extracts products and their associated images
   */
  static async parseProductsZip(file: File): Promise<ZipImportPreview> {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);

    const folderMap: {
      [folderName: string]: {
        jsonFile?: JSZip.JSZipObject;
        imageFiles: { name: string; zipObj: JSZip.JSZipObject }[];
      };
    } = {};

    // Scan all files in the ZIP archive
    contents.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return;

      const pathParts = relativePath.split('/').filter(p => p.trim().length > 0);
      
      // Look for folders (e.g. produtos/produto-001/produto.json or produto-001/produto.json)
      let folderKey = 'root';
      if (pathParts.length >= 2) {
        // e.g. produtos/prod-1/file.jpg -> key is prod-1
        folderKey = pathParts[pathParts.length - 2];
      } else if (pathParts.length === 1) {
        folderKey = 'root';
      }

      if (!folderMap[folderKey]) {
        folderMap[folderKey] = { imageFiles: [] };
      }

      const fileName = pathParts[pathParts.length - 1].toLowerCase();

      if (fileName.endsWith('.json')) {
        folderMap[folderKey].jsonFile = zipEntry;
      } else if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.webp') ||
        fileName.endsWith('.svg')
      ) {
        folderMap[folderKey].imageFiles.push({
          name: pathParts[pathParts.length - 1],
          zipObj: zipEntry,
        });
      }
    });

    const validProducts: ZipImportPreview['validProducts'] = [];
    const errors: ZipImportPreview['errors'] = [];
    let totalImages = 0;

    const folderEntries = Object.entries(folderMap);

    for (const [folderName, { jsonFile, imageFiles }] of folderEntries) {
      if (folderName === '__MACOSX') continue;

      if (!jsonFile) {
        if (imageFiles.length > 0) {
          errors.push({
            folderName,
            reason: `Nenhum arquivo 'produto.json' encontrado nesta pasta (${imageFiles.length} imagens órfãs).`,
          });
        }
        continue;
      }

      try {
        const jsonText = await jsonFile.async('text');
        const rawData = JSON.parse(jsonText);

        if (!rawData.nome && !rawData.name) {
          errors.push({
            folderName,
            reason: `Campo 'nome' ou 'name' obrigatório não encontrado no JSON.`,
          });
          continue;
        }

        // Convert images to base64 data URLs
        const convertedImages: { name: string; dataUrl: string; isMain: boolean }[] = [];

        // Sort images so imagem1 / 01 / cover comes first
        const sortedImageFiles = [...imageFiles].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

        for (let i = 0; i < sortedImageFiles.length; i++) {
          const imgObj = sortedImageFiles[i];
          const imgExt = imgObj.name.split('.').pop()?.toLowerCase() || 'jpg';
          const mimeType = imgExt === 'png' ? 'image/png' : imgExt === 'webp' ? 'image/webp' : imgExt === 'svg' ? 'image/svg+xml' : 'image/jpeg';

          const base64 = await imgObj.zipObj.async('base64');
          const dataUrl = `data:${mimeType};base64,${base64}`;

          convertedImages.push({
            name: imgObj.name,
            dataUrl,
            isMain: i === 0,
          });
          totalImages++;
        }

        const fallbackImage = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop';
        const mainImage = convertedImages.length > 0 ? convertedImages[0].dataUrl : (rawData.imagemPrincipal || rawData.mainImage || fallbackImage);
        const gallery = convertedImages.map(img => img.dataUrl);

        const productData: Partial<Product> = {
          name: rawData.nome || rawData.name,
          sku: rawData.sku || rawData.codigo || `SAT-${Math.floor(1000 + Math.random() * 9000)}`,
          category: rawData.categoria || rawData.category || 'Eletrônicos',
          price: Number(rawData.preco || rawData.price || 0),
          promotionalPrice: rawData.precoPromocional || rawData.promotionalPrice ? Number(rawData.precoPromocional || rawData.promotionalPrice) : undefined,
          isOffer: Boolean(rawData.oferta || rawData.isOffer || (rawData.precoPromocional && Number(rawData.precoPromocional) < Number(rawData.preco))),
          stock: Number(rawData.estoque || rawData.stock || 10),
          description: rawData.descricao || rawData.description || 'Produto importado via SAT LOJA ZIP.',
          detailedDescription: rawData.descricaoDetalhada || rawData.detailedDescription || rawData.descricao || '',
          isFeatured: Boolean(rawData.destaque || rawData.isFeatured),
          isActive: rawData.ativo !== undefined ? Boolean(rawData.ativo) : true,
          tags: Array.isArray(rawData.tags) ? rawData.tags : [rawData.categoria || 'eletronicos', 'importado'],
          mainImage,
          gallery: gallery.length > 0 ? gallery : [mainImage],
          specs: rawData.especificacoes || rawData.specs || {},
        };

        validProducts.push({
          folderName,
          productData,
          images: convertedImages,
        });
      } catch (err: any) {
        errors.push({
          folderName,
          reason: `Erro ao interpretar JSON: ${err.message || 'JSON inválido'}`,
        });
      }
    }

    return {
      totalFolders: folderEntries.length,
      validProducts,
      errors,
      totalImages,
    };
  }

  /**
   * Generates a downloadable ZIP backup of all products with folders, produto.json and images
   */
  static async exportProductsZip(products: Product[]): Promise<Blob> {
    const zip = new JSZip();
    const rootFolder = zip.folder('produtos');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const safeFolderName = (product.sku || `produto-${i + 1}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const prodFolder = rootFolder?.folder(safeFolderName);

      if (!prodFolder) continue;

      // Create product.json
      const jsonContent = {
        nome: product.name,
        sku: product.sku,
        categoria: product.category,
        preco: product.price,
        precoPromocional: product.promotionalPrice,
        estoque: product.stock,
        oferta: product.isOffer,
        destaque: product.isFeatured,
        ativo: product.isActive,
        descricao: product.description,
        descricaoDetalhada: product.detailedDescription,
        tags: product.tags,
        especificacoes: product.specs,
        dataCadastro: product.createdAt,
      };

      prodFolder.file('produto.json', JSON.stringify(jsonContent, null, 2));

      // Check if images are data URLs or external URLs
      const allImages = [product.mainImage, ...(product.gallery || [])].filter((img, idx, arr) => arr.indexOf(img) === idx);

      for (let imgIdx = 0; imgIdx < allImages.length; imgIdx++) {
        const imgUrl = allImages[imgIdx];
        if (!imgUrl) continue;

        if (imgUrl.startsWith('data:image/')) {
          const mimeMatch = imgUrl.match(/data:image\/([a-zA-Z+]+);base64,(.+)$/);
          if (mimeMatch) {
            const ext = mimeMatch[1].replace('+xml', '');
            const base64Data = mimeMatch[2];
            prodFolder.file(`imagem${imgIdx + 1}.${ext}`, base64Data, { base64: true });
          }
        } else {
          // It's a web URL - create a text reference file or note
          prodFolder.file(`imagem${imgIdx + 1}_url.txt`, imgUrl);
        }
      }
    }

    // Add a README.md file inside zip
    zip.file(
      'LEIAME.txt',
      `SAT LOJA — BACKUP COMPLETO DE PRODUTOS\nData de exportação: ${new Date().toLocaleString('pt-BR')}\nTotal de produtos: ${products.length}\n\nEstrutura:\n/produtos/nome-do-produto/\n   ├── produto.json\n   ├── imagem1.jpg\n   └── imagem2.jpg\n\nEste arquivo pode ser reimportado diretamente no Painel Administrativo > Importar ZIP.`
    );

    return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  }

  /**
   * Compatibility alias for parseProductZip returning ZipImportResult
   */
  static async parseProductZip(file: File): Promise<ZipImportResult> {
    const preview = await this.parseProductsZip(file);
    const products: Product[] = preview.validProducts.map((vp, index) => {
      const p = vp.productData;
      return {
        id: 'prod-zip-' + Date.now() + '-' + index,
        name: p.name || 'Produto sem nome',
        sku: p.sku || 'SAT-' + Math.floor(1000 + Math.random() * 9000),
        description: p.description || '',
        detailedDescription: p.detailedDescription || '',
        category: p.category || 'Geral',
        price: p.price || 0,
        promotionalPrice: p.promotionalPrice,
        isOffer: Boolean(p.isOffer),
        stock: p.stock !== undefined ? p.stock : 10,
        mainImage: p.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [p.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'],
        isActive: p.isActive !== undefined ? p.isActive : true,
        isFeatured: Boolean(p.isFeatured),
        tags: p.tags || ['importado'],
        specs: p.specs || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const warnings = preview.errors.map(e => `[${e.folderName}]: ${e.reason}`);

    return {
      totalFolders: preview.totalFolders,
      totalImagesFound: preview.totalImages,
      products,
      warnings,
      errors: [],
    };
  }

  /**
   * Export products to ZIP and trigger download directly
   */
  static async exportProductsToZip(products: Product[], filename = 'sat_loja_produtos.zip'): Promise<void> {
    const blob = await this.exportProductsZip(products);
    this.downloadBlob(blob, filename);
  }

  /**
   * Helper to trigger download in browser
   */
  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
