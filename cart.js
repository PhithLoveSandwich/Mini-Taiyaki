/**
 * โหลด cart จาก LocalStorage ถ้ามี ถ้าไม่มีให้ใช้ Object ว่าง
 */
const cart = JSON.parse(localStorage.getItem("cart")) || {};

/**
 * ฟังก์ชันบันทึก cart ลง LocalStorage
 */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * ใช้ querySelectorAll เลือกทุก element ที่อยู่ class ของ add-to-cart และใช้ forEach loop 
 */
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));
    
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price };
    } else {
      cart[productId].quantity++;
    }

    saveCart(); // บันทึกลง LocalStorage
    updateCartDisplay();
  });
});

/**
 * ฟังก์ชันอัปเดตการแสดงผลของรถเข็น
 */
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  if (!cartElement) return; // ถ้าไม่มี element "cart" ให้หยุดทำงาน

  cartElement.innerHTML = "";

  let totalPrice = 0;

  // Create a table
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Quantity", "Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${productId}</td>
      <td>${item.quantity}</td>
      <td>$${item.price}</td>
      <td>$${itemTotalPrice}</td>
      <td>
        <button class="btn btn-danger delete-product" data-product-id="${productId}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }

  // ให้ปุ่มลบทำงาน
  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      delete cart[productId];
      saveCart(); // บันทึกการเปลี่ยนแปลงลง LocalStorage
      updateCartDisplay();
    });
  });
}

/**
 * โหลด cart เมื่อเปิดหน้าใหม่
 */
document.addEventListener("DOMContentLoaded", updateCartDisplay);

/**
 * ปุ่มพิมพ์ใบเสร็จ
 */
document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Thank you!", generateCartReceipt());
});

/**
 * ฟังก์ชันพิมพ์ใบเสร็จ
 */
function printReceipt(title, content) {
  const printWindow = window.open("", "_blank"); // ✅ แก้ไข Bug
  printWindow.document.write(
    `<html><head><title>${title}</title></head><body>${content}</body></html>`
  );
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

/**
 * ฟังก์ชันสร้างใบเสร็จของ Cart
 */
function generateCartReceipt() {
  let receiptContent = `
      <style>
        @page {
          size: 100mm 100mm;
        }
        body {
          width: 100mm;
          height: 100mm;
          margin: 0;
          padding: 1px;
          font-family: Arial, sans-serif;
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 5px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
      <p>SANGKONG SHOP!</p>
      <h2>Cart Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;

  let totalPrice = 0;

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;

    receiptContent += `
        <tr>
          <td>${productId}</td>
          <td>${item.quantity}</td>
          <td>$${item.price}</td>
          <td>$${itemTotalPrice}</td>
        </tr>`;

    totalPrice += itemTotalPrice;
  }

  receiptContent += `
        </tbody>
      </table>
      <p>Total Price: $${totalPrice}</p>
      <p>คุณ Kays Tel.088-888-8888</p>`;

  return receiptContent;
}
