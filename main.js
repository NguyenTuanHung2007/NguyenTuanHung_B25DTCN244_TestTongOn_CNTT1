let products = JSON.parse(localStorage.getItem("products")) || [];
let currentData = [...products];
let isEditing = false;

// Lưu vào localStorage
const saveToStorage = () => {
  localStorage.setItem("products", JSON.stringify(products));
};

// Update số lượng sản phẩm trên góc trang web
const updateBadge = () => {
  document.getElementById("totalBadge").textContent =
    `${products.length} sản phẩm`;
};

// Hiển thị sản phẩm
const renderProduct = (productsToRender = currentData) => {
  const tbody = document.getElementById("tbody");
  const emptyState = document.getElementById("emptyState");

  if (productsToRender.length === 0) {
    tbody.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  tbody.style.display = "table-row-group";

  let str = "";
  for (let i = 0; i < productsToRender.length; i++) {
    str += `<tr id="${productsToRender[i].id}">
              <td>${i + 1}</td>
              <td class="td-name">${productsToRender[i].name}</td>
              <td class="td-price">${productsToRender[i].price} ₫</td>
              <td style="font-weight: 700">${productsToRender[i].stock}</td>
              <td>Active</td>
              <td>
                <div class="td-actions">
                  <button class="btn btn-sm btn-edit" onclick="editProduct(${productsToRender[i].id})">✏ Sửa</button>
                  <button class="btn btn-sm btn-del" onclick="deleteProduct(${productsToRender[i].id})">✕ Xóa</button>
                </div>
              </td>
            </tr>`;
  }
  tbody.innerHTML = str;

  updateBadge();
};

// Hiển thị lỗi khi nhập sai
const showError = (fieldId, message) => {
  let field = document.getElementById(fieldId);
  let error = field.parentNode.querySelector(".error-msg");
  if (!error) {
    error = document.createElement("div");
    error.className = "error-msg";
    field.parentNode.appendChild(error);
  }
  error.textContent = message;
  error.style.color = "red";
  field.style.borderColor = "red";
};

// Xoá lỗi khi nhập đúng
const clearError = (fieldId) => {
  let field = document.getElementById(fieldId);
  let error = field.parentNode.querySelector(".error-msg");
  if (error) error.remove();
  field.style.borderColor = "";
};

// Validate dữ liệu đầu vào
const validateForm = () => {
  let name = document.getElementById("iName").value.trim();
  let price = document.getElementById("iPrice").value.trim();
  let stock = document.getElementById("iStock").value.trim();
  let editId = document.getElementById("editId").value;

  clearError("iName");
  clearError("iPrice");
  clearError("iStock");

  if (!name) {
    showError("iName", "Vui lòng nhập tên sản phẩm.");
    return false;
  }

  if (products.some((p) => p.name === name && p.id != editId)) {
    showError("iName", "Tên sản phẩm đã tồn tại.");
    return false;
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    showError("iPrice", "Giá phải là số dương lớn hơn 0.");
    return false;
  }
  if (
    !stock ||
    isNaN(stock) ||
    parseInt(stock) < 0 ||
    parseFloat(stock) != parseInt(stock)
  ) {
    showError("iStock", "Tồn kho phải là số nguyên lớn hơn hoặc bằng 0.");
    return false;
  }
  return true;
};

// Reset form
const resetForm = () => {
  document.getElementById("iName").value = "";
  document.getElementById("iPrice").value = "";
  document.getElementById("iStock").value = "";

  clearError("iName");
  clearError("iPrice");
  clearError("iStock");

  document.getElementById("formTitle").textContent = "Thêm sản phẩm mới";
  document.getElementById("editId").value = "";
  document.getElementById("btnSubmit").textContent = "Thêm sản phẩm";
  document.getElementById("btnReset").textContent = "Làm mới";

  isEditing = false;
};

// Thêm sản phẩm
const submitForm = () => {
  if (!validateForm()) {
    return;
  }

  const name = document.getElementById("iName").value.trim();
  const price = parseFloat(document.getElementById("iPrice").value);
  const stock = parseInt(document.getElementById("iStock").value);
  const maxId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
  const newId = maxId + 1;

  let product = {
    id: newId,
    name: name,
    price: price,
    stock: stock,
  };
  products.push(product);
  currentData = [...products];
  saveToStorage();
  alert("Thêm sản phẩm thành công!");
  renderProduct(currentData);
  resetForm();
};

// Sửa sản phẩm
const editProduct = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) {
    return;
  }

  document.getElementById("iName").value = product.name;
  document.getElementById("iPrice").value = product.price;
  document.getElementById("iStock").value = product.stock;
  document.getElementById("editId").value = id;

  document.getElementById("formTitle").textContent = "Chỉnh sửa sản phẩm";
  document.getElementById("btnSubmit").textContent = "Lưu thay đổi";
  document.getElementById("btnReset").textContent = "Huỷ cập nhật";

  isEditing = true;
};

// Cập nhật sản phẩm
const updateProduct = () => {
  if (!validateForm()) {
    return;
  }

  const editId = parseInt(document.getElementById("editId").value);
  const name = document.getElementById("iName").value.trim();
  const price = parseFloat(document.getElementById("iPrice").value);
  const stock = parseInt(document.getElementById("iStock").value);

  const productIndex = products.findIndex((p) => p.id === editId);

  if (productIndex !== -1) {
    products[productIndex] = { id: editId, name, price, stock };
    currentData = [...products];

    saveToStorage();
    alert("Cập nhật sản phẩm thành công!");
    renderProduct(currentData);
    resetForm();
  }
};

// Hàm xử lý submit chung (thêm hoặc sửa)
const handleFormSubmit = () => {
  if (isEditing) {
    updateProduct();
  } else {
    submitForm();
  }
};
document.getElementById("btnSubmit").onclick = handleFormSubmit;

// Xoá sản phẩm
const deleteProduct = (id) => {
  const product = products.find((p) => p.id === id);

  if (!product) {
    return;
  }

  if (!confirm(`Bạn có chắc muốn xóa "${product.name}"?`)) {
    return;
  }

  products = products.filter((p) => p.id !== id);
  currentData = [...products];

  saveToStorage();
  alert("Đã xoá thành công!");
  renderProduct(currentData);
  updateBadge();
};

// Sắp xếp sản phẩm
const sortProduct = () => {
  let sortValue = document.getElementById("sortSelect").value;
  let sorted = [...currentData];

  switch (sortValue) {
    case "price_asc":
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price_desc":
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    default:
      currentData = [...products];
      renderProduct(currentData);
      return;
  }

  currentData = sorted;
  renderProduct(currentData);
};

// Tìm kiếm sản phẩm
const search = () => {
  let keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  if (keyword === "") {
    currentData = [...products];
  } else {
    let filtered = products.filter((ele) =>
      ele.name.toLowerCase().includes(keyword),
    );
    currentData = filtered;
  }

  sortProduct();
  renderProduct(currentData);
};

renderProduct(currentData);
updateBadge();