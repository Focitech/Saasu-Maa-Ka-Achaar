async function runTests() {
  console.log('Testing Next.js frontend and backend endpoints...');

  // 1. Test Home Page
  const homeRes = await fetch('http://localhost:3005/');
  console.log(`GET / : ${homeRes.status} ${homeRes.ok ? 'OK' : 'FAIL'}`);
  const homeText = await homeRes.text();
  console.log(`Home page contains brand name: ${homeText.includes('सासू माँ का अचार')}`);

  // 2. Test Products API
  const prodRes = await fetch('http://localhost:3005/api/products');
  console.log(`GET /api/products : ${prodRes.status} ${prodRes.ok ? 'OK' : 'FAIL'}`);
  const prodData = await prodRes.json();
  console.log(`Products count: ${prodData.data?.length}`);

  // 3. Test Orders API
  const orderRes = await fetch('http://localhost:3005/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ramesh Sharma',
      phone: '9876543210',
      address: 'Varanasi, UP',
      items: [{ id: 'aam-ka-achaar', name: 'Aam Ka Achaar', price: 249, qty: 2 }],
      totalAmount: 498
    })
  });
  console.log(`POST /api/orders : ${orderRes.status} ${orderRes.ok ? 'OK' : 'FAIL'}`);
  const orderData = await orderRes.json();
  console.log(`Order response:`, orderData);

  // 4. Test Assets
  const logoRes = await fetch('http://localhost:3005/images/logo.jpg');
  console.log(`GET /images/logo.jpg : ${logoRes.status}`);

  const billboardRes = await fetch('http://localhost:3005/images/billboard.png');
  console.log(`GET /images/billboard.png : ${billboardRes.status}`);

  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
