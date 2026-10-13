import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Mode = 'dashboard' | 'orders' | 'customers' | 'enquiries' | 'inventory' | 'reports';
type Product = Database['public']['Tables']['products']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Enquiry = Database['public']['Tables']['enquiries']['Row'];
type Movement = Database['public']['Tables']['inventory_movements']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

const nav: { to: string; label: string }[] = [
  { to: '/admin/overview', label: 'Overview' }, { to: '/admin', label: 'Catalogue' }, { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/enquiries', label: 'Enquiries' }, { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory' }, { to: '/admin/reports', label: 'Reports' },
];
const money = (n: number | null | undefined) => `Rs. ${Number(n ?? 0).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`;
const date = (s: string) => new Date(s).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
const input = 'w-full rounded border border-[#d8d0c5] bg-white px-3 py-2 text-sm text-[#20221e] focus:outline-none focus:ring-2 focus:ring-[#b89a56]';
const btn = 'inline-flex items-center justify-center rounded bg-[#062c21] px-4 py-2 text-sm font-medium text-[#f1d99a] disabled:opacity-50';
const label = 'block space-y-1 text-sm text-[#5d554b]';

export function AdminOperations({ mode }: { mode: Mode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [customerForm, setCustomerForm] = useState({ full_name: '', phone: '', email: '', city: '', address: '', notes: '' });
  const [enquiryForm, setEnquiryForm] = useState({ customer_name: '', phone: '', email: '', channel: 'whatsapp', subject: '', message: '', follow_up_at: '' });
  const [orderForm, setOrderForm] = useState({ customer_name: '', phone: '', email: '', product_id: '', quantity: '1', unit_price: '', shipping_fee: '0', discount: '0', paid: '0', source: 'whatsapp', payment_method: 'manual', shipping_address: '', city: '', notes: '' });
  const [movementForm, setMovementForm] = useState({ product_id: '', movement_type: 'restock', quantity: '1', reason: '' });

  const load = useCallback(async () => {
    setMessage('');
    const tasks: Promise<void>[] = [];
    if (mode === 'dashboard' || mode === 'reports') {
      tasks.push((async () => { const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100); if (error) throw error; setOrders(data ?? []); })());
      tasks.push((async () => { const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(100); if (error) throw error; setEnquiries(data ?? []); })());
      tasks.push((async () => { const { data, error } = await supabase.from('products').select('*').order('title'); if (error) throw error; setProducts(data ?? []); })());
      if (mode === 'reports') tasks.push((async () => { const { data, error } = await supabase.from('order_items').select('*').order('created_at', { ascending: false }).limit(1000); if (error) throw error; setOrderItems(data ?? []); })());
    }
    if (mode === 'orders') {
      tasks.push((async () => { const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200); if (error) throw error; setOrders(data ?? []); })());
      tasks.push((async () => { const { data, error } = await supabase.from('products').select('*').order('title'); if (error) throw error; setProducts(data ?? []); })());
    }
    if (mode === 'customers') {
      tasks.push((async () => { const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(500); if (error) throw error; setCustomers(data ?? []); })());
      tasks.push((async () => { const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(1000); if (error) throw error; setOrders(data ?? []); })());
    }
    if (mode === 'enquiries') tasks.push((async () => { const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(500); if (error) throw error; setEnquiries(data ?? []); })());
    if (mode === 'inventory') {
      tasks.push((async () => { const { data, error } = await supabase.from('products').select('*').order('title'); if (error) throw error; setProducts(data ?? []); })());
      tasks.push((async () => { const { data, error } = await supabase.from('inventory_movements').select('*').order('created_at', { ascending: false }).limit(100); if (error) throw error; setMovements(data ?? []); })());
    }
    try { await Promise.all(tasks); } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not load records. Check your admin role and database migration.'); }
  }, [mode]);

  useEffect(() => { void load(); }, [load]);

  const title = ({ dashboard: 'Business overview', orders: 'Orders & sales', customers: 'Customer book', enquiries: 'Customer enquiries', inventory: 'Inventory control', reports: 'Sales reports' } as const)[mode];
  const totalRevenue = useMemo(() => orders.filter(o => !['cancelled','refunded'].includes(o.status) && o.payment_status !== 'refunded').reduce((s, o) => s + Number(o.total_pkr), 0), [orders]);
  const collected = useMemo(() => orders.reduce((s, o) => s + Number(o.paid_amount_pkr), 0), [orders]);
  const grossProfit = useMemo(() => orderItems.filter(i => i.unit_cost_pkr !== null && orders.some(o => o.id === i.order_id && o.status !== 'cancelled' && o.payment_status !== 'refunded')).reduce((s, i) => s + (Number(i.unit_price_pkr) - Number(i.unit_cost_pkr)) * i.quantity, 0), [orderItems, orders]);
  const knownCostLines = orderItems.filter(i => i.unit_cost_pkr !== null).length;
  const openOrders = orders.filter(o => !['delivered','cancelled'].includes(o.status));
  const lowStock = products.filter(p => p.stock_quantity <= 2);

  const ensureCustomer = async (details: { full_name: string; phone?: string; email?: string; city?: string; address?: string }) => {
    const phone = details.phone?.trim() || null;
    const email = details.email?.trim().toLowerCase() || null;
    let existingId: string | null = null;
    if (phone) {
      const { data, error } = await supabase.from('customers').select('id').eq('phone', phone).limit(1).maybeSingle();
      if (error) throw error;
      existingId = data?.id ?? null;
    }
    if (!existingId && email) {
      const { data, error } = await supabase.from('customers').select('id').eq('email', email).limit(1).maybeSingle();
      if (error) throw error;
      existingId = data?.id ?? null;
    }
    const values = { full_name: details.full_name.trim(), phone, email, city: details.city?.trim() || null, address: details.address?.trim() || null };
    if (existingId) {
      const { error } = await supabase.from('customers').update(values).eq('id', existingId);
      if (error) throw error;
      return existingId;
    }
    const { data, error } = await supabase.from('customers').insert(values).select('id').single();
    if (error) throw error;
    return data.id;
  };

  const saveCustomer = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const { error } = await supabase.from('customers').insert({
        full_name: customerForm.full_name.trim(), phone: customerForm.phone || null, email: customerForm.email || null,
        city: customerForm.city || null, address: customerForm.address || null, notes: customerForm.notes || null,
      });
      if (error) throw error;
      setCustomerForm({ full_name: '', phone: '', email: '', city: '', address: '', notes: '' });
      setMessage('Customer saved.'); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save customer.'); }
    finally { setBusy(false); }
  };

  const saveEnquiry = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const customerId = await ensureCustomer({ full_name: enquiryForm.customer_name, phone: enquiryForm.phone, email: enquiryForm.email });
      const { error } = await supabase.from('enquiries').insert({
        customer_id: customerId, customer_name: enquiryForm.customer_name.trim(), phone: enquiryForm.phone || null, email: enquiryForm.email || null,
        channel: enquiryForm.channel, subject: enquiryForm.subject || null, message: enquiryForm.message || null,
        follow_up_at: enquiryForm.follow_up_at ? new Date(enquiryForm.follow_up_at).toISOString() : null,
      });
      if (error) throw error;
      setEnquiryForm({ customer_name: '', phone: '', email: '', channel: 'whatsapp', subject: '', message: '', follow_up_at: '' });
      setMessage('Enquiry recorded.'); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save enquiry.'); }
    finally { setBusy(false); }
  };

  const saveOrder = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    const product = products.find(p => p.id === orderForm.product_id);
    const quantity = Math.floor(Number(orderForm.quantity));
    const price = Number(orderForm.unit_price);
    const shipping = Number(orderForm.shipping_fee || 0);
    const discount = Number(orderForm.discount || 0);
    const paid = Number(orderForm.paid || 0);
    if (!product || quantity < 1 || price < 0 || !Number.isFinite(price) || shipping < 0 || discount < 0 || paid < 0) {
      setMessage('Select a product and enter valid quantity and non-negative amounts.'); setBusy(false); return;
    }
    const subtotal = quantity * price;
    const total = Math.max(0, subtotal + shipping - discount);
    if (paid > total) { setMessage('Amount paid cannot exceed the order total.'); setBusy(false); return; }
    let orderId: string | null = null;
    try {
      const customerId = await ensureCustomer({ full_name: orderForm.customer_name, phone: orderForm.phone, email: orderForm.email, city: orderForm.city, address: orderForm.shipping_address });
      const { data: order, error } = await supabase.from('orders').insert({
        order_number: '', customer_id: customerId, customer_name: orderForm.customer_name.trim(), phone: orderForm.phone || null,
        email: orderForm.email || null, status: 'pending', payment_status: paid === 0 ? 'unpaid' : paid >= total ? 'paid' : 'partial',
        payment_method: orderForm.payment_method, subtotal_pkr: subtotal, shipping_fee_pkr: shipping,
        discount_pkr: discount, total_pkr: total, paid_amount_pkr: paid, source: orderForm.source,
        shipping_address: orderForm.shipping_address || null, city: orderForm.city || null, notes: orderForm.notes || null,
      }).select('*').single();
      if (error) throw error;
      orderId = order.id;
      const { error: itemError } = await supabase.from('order_items').insert({
        order_id: order.id, product_id: product.id, product_title: product.title, sku: product.sku,
        quantity, unit_price_pkr: price, unit_cost_pkr: product.cost_price_pkr, line_total_pkr: subtotal,
      });
      if (itemError) throw itemError;
      setOrderForm({ customer_name: '', phone: '', email: '', product_id: '', quantity: '1', unit_price: '', shipping_fee: '0', discount: '0', paid: '0', source: 'whatsapp', payment_method: 'manual', shipping_address: '', city: '', notes: '' });
      setMessage(`Order ${order.order_number} created.`); await load();
    } catch (e) {
      if (orderId) await supabase.from('orders').delete().eq('id', orderId);
      setMessage(e instanceof Error ? e.message : 'Could not create order.');
    } finally { setBusy(false); }
  };

  const changeOrder = async (order: Order, field: 'status' | 'payment_status', value: string) => {
    setMessage('');
    const { error } = await supabase.from('orders').update({ [field]: value }).eq('id', order.id);
    setMessage(error ? error.message : `${order.order_number} updated.`);
    await load();
  };

  const saveMovement = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    const qty = Math.floor(Number(movementForm.quantity));
    if (!movementForm.product_id || qty < 1 || !movementForm.reason.trim()) { setMessage('Choose a product, quantity and reason.'); setBusy(false); return; }
    const sign = ['restock','return','opening'].includes(movementForm.movement_type) ? 1 : -1;
    try {
      const { error } = await supabase.from('inventory_movements').insert({
        product_id: movementForm.product_id, movement_type: movementForm.movement_type,
        quantity_delta: qty * sign, reason: movementForm.reason.trim(),
      });
      if (error) throw error;
      setMovementForm({ product_id: '', movement_type: 'restock', quantity: '1', reason: '' });
      setMessage('Stock movement recorded.'); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not update stock.'); }
    finally { setBusy(false); }
  };

  const statusClass = (value: string) => `rounded-full px-2.5 py-1 text-xs capitalize ${['paid','delivered','converted'].includes(value) ? 'bg-emerald-100 text-emerald-800' : ['cancelled','lost'].includes(value) ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`;
  const panel = 'rounded-lg border border-[#e6dfd3] bg-white p-4 shadow-sm';
  const table = 'w-full text-left text-sm';
  const heading = 'mb-3 font-serif text-lg text-[#1c2b23]';

  return <main className="min-h-screen bg-[#f8f6f0] text-[#242720]">
    <header className="border-b border-[#e6dfd3] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div><p className="text-xs uppercase tracking-[.24em] text-[#94763c]">NOVALESTIC JEWELLERS</p><h1 className="font-serif text-xl">{title}</h1></div>
        <div className="flex gap-3 text-sm"><Link to="/" className="underline">Storefront</Link><button onClick={async()=>{await supabase.auth.signOut(); window.location.href='/admin/login';}} className="underline">Sign out</button></div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3">{nav.map(n=><Link key={n.to} to={n.to as never} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${(mode==='dashboard'&&n.to==='/admin/overview')||(n.to==='/admin/'+mode)?'border-[#092e23] bg-[#092e23] text-[#f1d99a]':'border-[#e6dfd3] bg-white text-[#5d554b] hover:border-[#b89a56]'}`}>{n.label}</Link>)}</nav>
    </header>
    <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-7">
      {message && <p role="status" className="rounded border border-[#e6d8b5] bg-[#fff8e6] px-4 py-3 text-sm">{message}</p>}
      {(mode==='dashboard'||mode==='reports') && <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Recent recorded sales',money(totalRevenue),'Latest 100 recorded orders'],
            ['Payments received (recent)',money(collected),'Latest 100 recorded orders'],
            ...(mode === 'reports' ? [['Gross profit estimate', money(grossProfit), 'Cost known for ' + knownCostLines + ' line items'] as string[]] : []),
            ['Open orders',String(openOrders.length),'Pending through shipped'],
            ['Open enquiries',String(enquiries.filter(e=>!['converted','lost'].includes(e.status)).length),'Need follow-up or response'],
          ].map(([k,v,d])=><section className={panel} key={k}><p className="text-sm text-[#71695d]">{k}</p><p className="mt-2 font-serif text-2xl">{v}</p><p className="mt-1 text-xs text-[#8a8174]">{d}</p></section>)}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className={panel}><h2 className={heading}>Recent orders</h2>{orders.length===0?<p className="text-sm text-[#7a7368]">No orders recorded yet. Create the first manual order from Orders.</p>:<div className="overflow-x-auto"><table className={table}><thead><tr><th className="py-2">Order</th><th>Customer</th><th>Status</th><th className="text-right">Total</th></tr></thead><tbody>{orders.slice(0,8).map(o=><tr key={o.id} className="border-t border-[#eee8de]"><td className="py-3 font-medium">{o.order_number}</td><td>{o.customer_name}</td><td><span className={statusClass(o.status)}>{o.status}</span></td><td className="text-right">{money(o.total_pkr)}</td></tr>)}</tbody></table></div>}</section>
          <section className={panel}><h2 className={heading}>Inventory attention</h2>{lowStock.length===0?<p className="text-sm text-[#7a7368]">No products have 2 or fewer units recorded.</p>:<ul className="space-y-3">{lowStock.slice(0,8).map(p=><li key={p.id} className="flex items-center justify-between border-b border-[#eee8de] pb-2 text-sm"><span>{p.title}<span className="ml-2 text-xs text-[#7a7368]">{p.sku||'No SKU'}</span></span><span className={statusClass(p.stock_quantity===0?'cancelled':'pending')}>{p.stock_quantity} units</span></li>)}</ul>}<Link to="/admin/inventory" className="mt-4 inline-block text-sm underline">Manage inventory</Link></section>
        </div>
      </>}
      {mode==='orders' && <>
        <section className={panel}><h2 className={heading}>Record a manual order</h2><p className="mb-4 text-sm text-[#766e62]">For orders received through WhatsApp, phone, Instagram or in person. No online payment is taken here.</p>
          <form onSubmit={saveOrder} className="grid gap-3 md:grid-cols-3">
            <label className={label}>Customer name *<input required value={orderForm.customer_name} onChange={e=>setOrderForm({...orderForm,customer_name:e.target.value})} className={input}/></label>
            <label className={label}>Phone<input value={orderForm.phone} onChange={e=>setOrderForm({...orderForm,phone:e.target.value})} className={input}/></label>
            <label className={label}>Email<input type="email" value={orderForm.email} onChange={e=>setOrderForm({...orderForm,email:e.target.value})} className={input}/></label>
            <label className={label}>Product *<select required value={orderForm.product_id} onChange={e=>{const p=products.find(p=>p.id===e.target.value);setOrderForm({...orderForm,product_id:e.target.value,unit_price:p?.pricing_mode==='fixed'&&p.price_pkr!==null?String(p.price_pkr):orderForm.unit_price});}} className={input}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.title}{p.sku?` · ${p.sku}`:''}</option>)}</select></label>
            <label className={label}>Quantity *<input required type="number" min="1" step="1" value={orderForm.quantity} onChange={e=>setOrderForm({...orderForm,quantity:e.target.value})} className={input}/></label>
            <label className={label}>Unit price (PKR) *<input required type="number" min="0" step="0.01" value={orderForm.unit_price} onChange={e=>setOrderForm({...orderForm,unit_price:e.target.value})} className={input}/></label>
            <label className={label}>Shipping fee<input type="number" min="0" value={orderForm.shipping_fee} onChange={e=>setOrderForm({...orderForm,shipping_fee:e.target.value})} className={input}/></label>
            <label className={label}>Discount<input type="number" min="0" value={orderForm.discount} onChange={e=>setOrderForm({...orderForm,discount:e.target.value})} className={input}/></label>
            <label className={label}>Amount received<input type="number" min="0" value={orderForm.paid} onChange={e=>setOrderForm({...orderForm,paid:e.target.value})} className={input}/></label>
            <label className={label}>Order source<select value={orderForm.source} onChange={e=>setOrderForm({...orderForm,source:e.target.value})} className={input}>{['whatsapp','phone','instagram','in_person','manual','website','other'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></label>
            <label className={label}>Payment method<select value={orderForm.payment_method} onChange={e=>setOrderForm({...orderForm,payment_method:e.target.value})} className={input}>{['manual','cash','bank_transfer','card','cod','other'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></label>
            <label className={label}>City<input value={orderForm.city} onChange={e=>setOrderForm({...orderForm,city:e.target.value})} className={input}/></label>
            <label className={`${label} md:col-span-2`}>Shipping address<textarea rows={2} value={orderForm.shipping_address} onChange={e=>setOrderForm({...orderForm,shipping_address:e.target.value})} className={input}/></label>
            <label className={`${label} md:col-span-3`}>Internal notes<textarea rows={2} value={orderForm.notes} onChange={e=>setOrderForm({...orderForm,notes:e.target.value})} className={input}/></label>
            <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee8de] pt-4"><p className="text-sm">Estimated total: <strong>{money(Math.max(0,Number(orderForm.quantity||0)*Number(orderForm.unit_price||0)+Number(orderForm.shipping_fee||0)-Number(orderForm.discount||0)))}</strong></p><button disabled={busy||products.length===0} className={btn}>{busy?'Saving…':'Create order'}</button></div>
          </form>
        </section>
        <section className={panel}><h2 className={heading}>Orders ({orders.length})</h2>{orders.length===0?<p className="text-sm text-[#7a7368]">No orders yet.</p>:<div className="overflow-x-auto"><table className={table}><thead><tr><th className="py-2">Order / date</th><th>Customer</th><th>Total</th><th>Order status</th><th>Payment</th></tr></thead><tbody>{orders.map(o=><tr key={o.id} className="border-t border-[#eee8de] align-middle"><td className="py-3"><strong>{o.order_number}</strong><p className="text-xs text-[#8a8174]">{date(o.created_at)}</p></td><td>{o.customer_name}<p className="text-xs text-[#8a8174]">{o.phone||o.email||'No contact'}</p></td><td>{money(o.total_pkr)}<p className="text-xs text-[#8a8174]">Paid {money(o.paid_amount_pkr)}</p></td><td><select aria-label={`Status for ${o.order_number}`} value={o.status} onChange={e=>void changeOrder(o,'status',e.target.value)} className={input}>{['pending','confirmed','processing','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</select></td><td><select aria-label={`Payment for ${o.order_number}`} value={o.payment_status} onChange={e=>void changeOrder(o,'payment_status',e.target.value)} className={input}>{['unpaid','partial','paid','refunded'].map(s=><option key={s} value={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>}</section>
      </>}
      {mode==='customers' && <>
        <section className={panel}><h2 className={heading}>Add customer</h2><form onSubmit={saveCustomer} className="grid gap-3 md:grid-cols-3">
          <label className={label}>Full name *<input required value={customerForm.full_name} onChange={e=>setCustomerForm({...customerForm,full_name:e.target.value})} className={input}/></label>
          <label className={label}>Phone<input value={customerForm.phone} onChange={e=>setCustomerForm({...customerForm,phone:e.target.value})} className={input}/></label>
          <label className={label}>Email<input type="email" value={customerForm.email} onChange={e=>setCustomerForm({...customerForm,email:e.target.value})} className={input}/></label>
          <label className={label}>City<input value={customerForm.city} onChange={e=>setCustomerForm({...customerForm,city:e.target.value})} className={input}/></label>
          <label className={label}>Address<input value={customerForm.address} onChange={e=>setCustomerForm({...customerForm,address:e.target.value})} className={input}/></label>
          <label className={label}>Notes<input value={customerForm.notes} onChange={e=>setCustomerForm({...customerForm,notes:e.target.value})} className={input}/></label>
          <div className="md:col-span-3"><button disabled={busy} className={btn}>{busy?'Saving…':'Save customer'}</button></div>
        </form></section>
        <section className={panel}><h2 className={heading}>Customers ({customers.length})</h2>{customers.length===0?<p className="text-sm text-[#7a7368]">No customer records yet.</p>:<div className="overflow-x-auto"><table className={table}><thead><tr><th className="py-2">Name</th><th>Contact</th><th>Location</th><th>Orders / spend</th><th>Added</th></tr></thead><tbody>{customers.map(c=><tr key={c.id} className="border-t border-[#eee8de]"><td className="py-3 font-medium">{c.full_name}</td><td>{c.phone||'—'}<p className="text-xs text-[#8a8174]">{c.email||''}</p></td><td>{c.city||'—'}</td><td>{orders.filter(o=>o.customer_id===c.id && o.status!=='cancelled').length} orders<p className="text-xs text-[#8a8174]">{money(orders.filter(o=>o.customer_id===c.id && o.status!=='cancelled').reduce((sum,o)=>sum+Number(o.total_pkr),0))}</p></td><td>{date(c.created_at)}</td></tr>)}</tbody></table></div>}</section>
      </>}
      {mode==='enquiries' && <>
        <section className={panel}><h2 className={heading}>Record an enquiry</h2><form onSubmit={saveEnquiry} className="grid gap-3 md:grid-cols-3">
          <label className={label}>Customer name *<input required value={enquiryForm.customer_name} onChange={e=>setEnquiryForm({...enquiryForm,customer_name:e.target.value})} className={input}/></label>
          <label className={label}>Phone<input value={enquiryForm.phone} onChange={e=>setEnquiryForm({...enquiryForm,phone:e.target.value})} className={input}/></label>
          <label className={label}>Email<input type="email" value={enquiryForm.email} onChange={e=>setEnquiryForm({...enquiryForm,email:e.target.value})} className={input}/></label>
          <label className={label}>Channel<select value={enquiryForm.channel} onChange={e=>setEnquiryForm({...enquiryForm,channel:e.target.value})} className={input}>{['website','whatsapp','phone','instagram','in_person','other'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></label>
          <label className={label}>Subject / product<input value={enquiryForm.subject} onChange={e=>setEnquiryForm({...enquiryForm,subject:e.target.value})} className={input}/></label>
          <label className={label}>Follow-up date<input type="datetime-local" value={enquiryForm.follow_up_at} onChange={e=>setEnquiryForm({...enquiryForm,follow_up_at:e.target.value})} className={input}/></label>
          <label className={`${label} md:col-span-3`}>Message and notes<textarea rows={2} value={enquiryForm.message} onChange={e=>setEnquiryForm({...enquiryForm,message:e.target.value})} className={input}/></label>
          <div className="md:col-span-3"><button disabled={busy} className={btn}>{busy?'Saving…':'Save enquiry'}</button></div>
        </form></section>
        <section className={panel}><h2 className={heading}>Enquiry pipeline ({enquiries.length})</h2>{enquiries.length===0?<p className="text-sm text-[#7a7368]">No enquiries recorded yet.</p>:<div className="space-y-3">{enquiries.map(q=><article key={q.id} className="grid gap-3 border-b border-[#eee8de] pb-3 md:grid-cols-[1fr_180px]"><div><div className="flex flex-wrap items-center gap-2"><strong>{q.customer_name}</strong><span className={statusClass(q.status)}>{q.status}</span></div><p className="mt-1 text-sm">{q.subject||'General enquiry'} · {q.channel.replace('_',' ')} · {date(q.created_at)}</p><p className="text-sm text-[#766e62]">{q.phone||q.email||'No contact details'}{q.follow_up_at? ` · Follow up ${date(q.follow_up_at)}`:''}</p>{q.message&&<p className="mt-1 whitespace-pre-wrap text-sm">{q.message}</p>}</div><label className={label}>Update status<select value={q.status} onChange={async e=>{const {error}=await supabase.from('enquiries').update({status:e.target.value}).eq('id',q.id);setMessage(error?error.message:'Enquiry status updated.');await load();}} className={input}>{['new','contacted','quoted','converted','lost'].map(s=><option key={s} value={s}>{s}</option>)}</select></label></article>)}</div>}</section>
      </>}
      {mode==='inventory' && <>
        <section className={panel}><h2 className={heading}>Record stock movement</h2><p className="mb-4 text-sm text-[#766e62]">Every change is recorded in a stock ledger. Outgoing stock cannot make the quantity negative.</p><form onSubmit={saveMovement} className="grid gap-3 md:grid-cols-4">
          <label className={label}>Product *<select required value={movementForm.product_id} onChange={e=>setMovementForm({...movementForm,product_id:e.target.value})} className={input}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.title} · {p.stock_quantity} units</option>)}</select></label>
          <label className={label}>Movement *<select value={movementForm.movement_type} onChange={e=>setMovementForm({...movementForm,movement_type:e.target.value})} className={input}>{[['opening','Opening stock'],['restock','Restock / received'],['return','Customer return'],['sale','Sale / dispatch'],['damage','Damaged / lost'],['adjustment','Adjustment (decrease)']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <label className={label}>Quantity *<input required type="number" min="1" step="1" value={movementForm.quantity} onChange={e=>setMovementForm({...movementForm,quantity:e.target.value})} className={input}/></label>
          <label className={label}>Reason *<input required value={movementForm.reason} onChange={e=>setMovementForm({...movementForm,reason:e.target.value})} placeholder="Invoice, sale or reason" className={input}/></label>
          <div className="md:col-span-4"><button disabled={busy||products.length===0} className={btn}>{busy?'Saving…':'Record movement'}</button></div>
        </form></section>
        <section className={panel}><h2 className={heading}>Current stock ({products.length} products)</h2>{products.length===0?<p className="text-sm text-[#7a7368]">Add products in the catalogue first.</p>:<div className="overflow-x-auto"><table className={table}><thead><tr><th className="py-2">Product</th><th>SKU</th><th>Visibility</th><th className="text-right">Units</th><th className="text-right">Attention</th></tr></thead><tbody>{products.map(p=><tr key={p.id} className="border-t border-[#eee8de]"><td className="py-3 font-medium">{p.title}</td><td>{p.sku||'—'}</td><td>{p.is_published?'Published':'Unpublished'}</td><td className="text-right"><span className={statusClass(p.stock_quantity<=2?'pending':'paid')}>{p.stock_quantity}</span></td><td className="text-right">{p.stock_quantity<=2?'Low stock':'Tracked'}</td></tr>)}</tbody></table></div>}<p className="mt-3 text-xs text-[#8a8174]">Record private cost prices in the catalogue. Cost prices are never displayed on the public storefront.</p></section>
        <section className={panel}><h2 className={heading}>Recent stock ledger</h2>{movements.length===0?<p className="text-sm text-[#7a7368]">No stock movements recorded yet.</p>:<div className="overflow-x-auto"><table className={table}><thead><tr><th className="py-2">Date</th><th>Product</th><th>Type</th><th>Reason</th><th className="text-right">Change</th></tr></thead><tbody>{movements.map(m=><tr key={m.id} className="border-t border-[#eee8de]"><td className="py-3">{date(m.created_at)}</td><td>{products.find(p=>p.id===m.product_id)?.title||'Deleted product'}</td><td>{m.movement_type}</td><td>{m.reason}</td><td className="text-right">{m.quantity_delta>0?'+':''}{m.quantity_delta}</td></tr>)}</tbody></table></div>}</section>
      </>}
    </div>
  </main>;
}
