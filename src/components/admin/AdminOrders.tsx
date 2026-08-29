import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Trash2,
  User,
  MapPin,
  FileText,
  Search,
  Edit,
  Save,
  X,
  CreditCard,
  Plus,
  Minus,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { db } from '../../services/db';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    onRefresh();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showNotification(`Status do pedido ${orderId} atualizado para ${getStatusName(newStatus)}.`);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    const deletedId = orderToDelete.id;
    db.deleteOrder(deletedId);
    if (selectedOrder?.id === deletedId) setSelectedOrder(null);
    if (editingOrder?.id === deletedId) setEditingOrder(null);
    setOrderToDelete(null);
    onRefresh();
    showNotification(`Pedido ${deletedId} excluído com sucesso.`);
  };

  const handleOpenEdit = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Clone order for editing
    setEditingOrder(JSON.parse(JSON.stringify(order)));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    // Recalculate subtotal and total
    const subtotal = editingOrder.items.reduce((sum, item) => {
      const price = item.product.promotionalPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const discount = Number(editingOrder.discount) || 0;
    const total = Math.max(0, subtotal - discount);

    const updatedData: Partial<Order> = {
      customerName: editingOrder.customerName,
      customerPhone: editingOrder.customerPhone,
      customerAddress: editingOrder.customerAddress,
      customerNotes: editingOrder.customerNotes,
      status: editingOrder.status,
      paymentMethod: editingOrder.paymentMethod,
      items: editingOrder.items,
      discount,
      subtotal,
      total,
    };

    const saved = db.updateOrder(editingOrder.id, updatedData);
    if (saved) {
      if (selectedOrder?.id === editingOrder.id) {
        setSelectedOrder(saved);
      }
      setEditingOrder(null);
      onRefresh();
      showNotification(`Pedido ${saved.id} editado e salvo com sucesso!`);
    }
  };

  const handleEditItemQuantity = (index: number, delta: number) => {
    if (!editingOrder) return;
    const newItems = [...editingOrder.items];
    const newQty = newItems[index].quantity + delta;
    if (newQty <= 0) {
      newItems.splice(index, 1);
    } else {
      newItems[index].quantity = newQty;
    }

    const subtotal = newItems.reduce((sum, item) => {
      const price = item.product.promotionalPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
    const discount = Number(editingOrder.discount) || 0;

    setEditingOrder({
      ...editingOrder,
      items: newItems,
      subtotal,
      total: Math.max(0, subtotal - discount),
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!editingOrder) return;
    const newItems = editingOrder.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => {
      const price = item.product.promotionalPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
    const discount = Number(editingOrder.discount) || 0;

    setEditingOrder({
      ...editingOrder,
      items: newItems,
      subtotal,
      total: Math.max(0, subtotal - discount),
    });
  };

  const getStatusName = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      case 'dispatched': return 'Despachado';
      default: return status;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30">
            <Clock className="w-3 h-3" />
            <span>Pendente</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmado</span>
          </span>
        );
      case 'shipped':
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Truck className="w-3 h-3" />
            <span>Enviado</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <PackageCheck className="w-3 h-3" />
            <span>Entregue</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Gestão de Pedidos & WhatsApp
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualize, edite detalhes, altere status e exclua pedidos iniciados pelo WhatsApp.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, telefone ou ID..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-amber-400 text-black'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st === 'all' && 'Todos'}
              {st === 'pending' && 'Pendentes'}
              {st === 'confirmed' && 'Confirmados'}
              {st === 'shipped' && 'Enviados'}
              {st === 'delivered' && 'Entregues'}
              {st === 'cancelled' && 'Cancelados'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Layout: Table + Side Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Orders Table */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">ID & Data</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Itens</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Nenhum pedido encontrado no filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`hover:bg-zinc-800/50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-zinc-800/80 ring-1 ring-amber-400/40' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <span className="text-white font-bold block">{order.id}</span>
                          <span className="text-zinc-500 text-[10px]">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-white block truncate max-w-[120px]">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {order.customerPhone}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-zinc-300 font-medium">
                            {order.items.reduce((a, b) => a + b.quantity, 0)} itens
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-amber-400 font-['Outfit']">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {/* WhatsApp button */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                              title="Abrir WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {/* Edit button */}
                            <button
                              onClick={(e) => handleOpenEdit(order, e)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition-colors"
                              title="Editar Pedido"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => setOrderToDelete(order)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 transition-colors"
                              title="Excluir Pedido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Details Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          {selectedOrder ? (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    Detalhes do Pedido
                  </span>
                  <h3 className="text-base font-black text-white font-mono">
                    {selectedOrder.id}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(selectedOrder)}
                    className="text-zinc-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                    title="Editar pedido completo"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setOrderToDelete(selectedOrder)}
                    className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Excluir este pedido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Update Control */}
              <div>
                <label className="block text-zinc-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Atualizar Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="p-3.5 rounded-xl bg-zinc-950 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>{selectedOrder.customerAddress}</span>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px] pt-1 border-t border-zinc-900">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Pagamento: <strong className="text-zinc-200 capitalize">{selectedOrder.paymentMethod}</strong></span>
                  </div>
                )}
                {selectedOrder.customerNotes && (
                  <div className="flex items-start gap-2 text-zinc-400 text-[11px] pt-1 border-t border-zinc-900">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span>Obs: {selectedOrder.customerNotes}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">
                    Itens Comprados ({selectedOrder.items.length})
                  </h4>
                  <button
                    onClick={() => handleOpenEdit(selectedOrder)}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Editar itens</span>
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center p-2 rounded-lg bg-zinc-950 border border-zinc-800/60">
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-contain bg-zinc-900 p-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                        <p className="text-[10px] text-zinc-400">
                          {item.quantity}x • R$ {(item.product.promotionalPrice || item.product.price).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-400 font-['Outfit']">
                        R$ {((item.product.promotionalPrice || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total summary */}
              <div className="pt-2 border-t border-zinc-800 space-y-1">
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Subtotal</span>
                  <span>R$ {selectedOrder.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 text-xs font-semibold">
                    <span>Desconto</span>
                    <span>- R$ {selectedOrder.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-1">
                  <span>Total</span>
                  <span className="text-amber-400 font-['Outfit'] text-base">
                    R$ {selectedOrder.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá ${selectedOrder.customerName}! Falamos da SAT LOJA referente ao seu pedido *${selectedOrder.id}*.\n\nStatus atual: *${getStatusName(selectedOrder.status)}*\nTotal: R$ ${selectedOrder.total.toFixed(2).replace('.', ',')}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedOrder)}
                    className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => setOrderToDelete(selectedOrder)}
                    className="flex items-center justify-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-500 text-xs">
              <ShoppingBag className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              Selecione um pedido na tabela ao lado para visualizar os detalhes completos, editar ou excluir.
            </div>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span>Editar Pedido</span>
                    <span className="font-mono text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                      {editingOrder.id}
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Altere os dados do cliente, status, forma de pagamento e itens.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Customer Information Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Informações do Cliente</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customerName}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customerPhone}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-300 font-semibold mb-1">Endereço de Entrega</label>
                    <input
                      type="text"
                      value={editingOrder.customerAddress}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerAddress: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-300 font-semibold mb-1">Observações do Pedido</label>
                    <textarea
                      rows={2}
                      value={editingOrder.customerNotes || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerNotes: e.target.value })}
                      placeholder="Ex: Entregar após as 14h, embalagem para presente..."
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Payment Section */}
              <div className="pt-3 border-t border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Status e Pagamento</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Status do Pedido</label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as OrderStatus })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Forma de Pagamento</label>
                    <select
                      value={editingOrder.paymentMethod}
                      onChange={(e) => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value as any })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="whatsapp">WhatsApp / A Combinar</option>
                      <option value="pix">Pix</option>
                      <option value="card">Cartão de Crédito</option>
                      <option value="money">Dinheiro / À Vista</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Desconto Aplicado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingOrder.discount || 0}
                      onChange={(e) => {
                        const disc = parseFloat(e.target.value) || 0;
                        setEditingOrder({
                          ...editingOrder,
                          discount: disc,
                          total: Math.max(0, editingOrder.subtotal - disc),
                        });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Items List in Modal */}
              <div className="pt-3 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Itens do Pedido ({editingOrder.items.length})</span>
                  </h4>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {editingOrder.items.length === 0 ? (
                    <div className="p-4 rounded-xl bg-zinc-950 text-center text-zinc-500">
                      Nenhum item adicionado a este pedido.
                    </div>
                  ) : (
                    editingOrder.items.map((item, idx) => {
                      const itemPrice = item.product.promotionalPrice || item.product.price;
                      return (
                        <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                          <img
                            src={item.product.mainImage}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-contain bg-zinc-900 p-0.5 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">{item.product.name}</p>
                            <p className="text-[10px] text-zinc-400">
                              Unitário: R$ {itemPrice.toFixed(2).replace('.', ',')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleEditItemQuantity(idx, -1)}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold font-mono text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEditItemQuantity(idx, 1)}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Item total */}
                            <span className="w-20 text-right font-bold text-amber-400 font-mono">
                              R$ {(itemPrice * item.quantity).toFixed(2).replace('.', ',')}
                            </span>

                            {/* Remove item button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                              title="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Totals Summary */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5 text-xs text-zinc-400">
                    <div>Subtotal: <strong className="text-zinc-200">R$ {editingOrder.subtotal.toFixed(2).replace('.', ',')}</strong></div>
                    {editingOrder.discount > 0 && (
                      <div className="text-emerald-400">Desconto: - R$ {editingOrder.discount.toFixed(2).replace('.', ',')}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">Total Final</span>
                    <span className="text-lg font-black text-amber-400 font-['Outfit']">
                      R$ {editingOrder.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all hover:scale-102 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir Pedido {orderToDelete.id}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você está prestes a remover o pedido do cliente <strong className="text-white">{orderToDelete.customerName}</strong> no valor de <strong className="text-amber-400">R$ {orderToDelete.total.toFixed(2).replace('.', ',')}</strong>. Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

