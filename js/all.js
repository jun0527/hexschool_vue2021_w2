const productList = document.querySelector(".js-productList");
const addProductBtn = document.querySelector(".js-addProductBtn");
const prompts = document.querySelectorAll(".formGroup label span");
const inputs = document.querySelectorAll(".formGroup input,.formGroup select,.formGroup textArea");
const addProduct = document.querySelector(".js-addProduct");
const app = {
  data: {
    url: "https://vue3-course-api.hexschool.io/",
    path: "jun0527",
    products: [],
    constraints: {
      productTitle: {
        presence: {
          message: "必填！"
        }
      },
      category: {
        presence: {
          message: "必填！"
        }
      },
      imageUrl: {
        presence: {
          message: "必填！"
        },
        url: {
          schemes: ["http", "https"],
          message: "網址格是錯誤，請輸入http或https開頭的網址！"
        }
      },
      description: {
        presence: {
          message: "必填！"
        }
      },
      originPrice: {
        presence: {
          message: "必填！"
        },
        numericality: {
          greaterThan: 0,
          message: "原價不得小於0！"
        }
      },
      price: {
        presence: {
          message: "必填！"
        },
        numericality: {
          greaterThan: 0,
          message: "原價不得小於0！"
        }
      },
      unit: {
        presence: {
          message: "必填！"
        }
      },
    }
  },
  init() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)signInCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(`${this.data.url}api/${this.data.path}/admin/products`)
      .then((res) => {
        if (res.data.success) {
          this.data.products = res.data.products;
          this.render();
        } else {
          alert("資料載入失敗，稍後請重新嘗試！");
        }
      })
      .catch((err) => {
        console.dir(err);
      })
  },
  click() {
    //新增商品
    addProductBtn.addEventListener("click", (e) => {
      prompts.forEach((item) => {
        item.textContent = "";
      })
      let error = validate(addProduct, this.data.constraints);
      if (error === undefined) {
        this.addProductData();
        return;
      }
      if (parseInt(originPrice.value) < parseInt(price.value)) {
        let priceField = document.querySelector(".price");
        priceField.textContent = "售價不得大於原價！"
      }
      let fieldName = Object.keys(error);
      fieldName.forEach((key) => {
        let span = document.querySelector(`.${key}`);
        span.textContent = error[key][0].split(" ").pop();
      })
    })
    // 修改商品啟用狀態
    productList.addEventListener("change", (e) => {
      let id = e.target.getAttribute("data-id");
      let index = e.target.getAttribute("data-index");
      let status;
      if (e.target.checked) {
        status = 1;
        this.changeEnabled(status, id, index);
      } else {
        status = 0
        this.changeEnabled(status, id, index);
      }
    })
    // 刪除商品
    productList.addEventListener("click", (e) => {
      if (e.target.getAttribute("class") === "deleteBtn") {
        let id = e.target.getAttribute("data-id");
        this.deleteProduct(id);
      }
    })
  },
  addProductData() {
    let obj = {
      data: {
        title: inputs[0].value,
        category: inputs[1].value,
        origin_price: parseInt(inputs[4].value),
        price: parseInt(inputs[5].value),
        unit: inputs[6].value,
        description: inputs[3].value,
        is_enabled: 0,
        imageUrl: inputs[2].value
      }
    }
    console.log(obj);
    axios.post(`${this.data.url}api/${this.data.path}/admin/product`, obj)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          this.init();
          this.clearField();
          alert("商品建立成功！");
        } else {
          alert("商品建立失敗！");
        }
      })
      .catch((err) => {
        console.dir(err);
      })
  },
  clearField() {
    inputs.forEach((item) => {
      item.value = "";
    })
  },
  changeEnabled(status, productId, index) {
    let obj = {
      "data": this.data.products[index]
    }
    obj.data.is_enabled = status;
    axios.put(`${this.data.url}api/${this.data.path}/admin/product/${productId}`, obj)
      .then((res) => {
        if (res.data.success) {
          alert("商品修改成功！");
          this.init();
        } else {
          alert("商品修改失敗！");
        }
      })
      .catch((err) => {
        console.dir(err);
      })
  },
  deleteProduct(productId) {
    axios.delete(`${this.data.url}api/${this.data.path}/admin/product/${productId}`)
      .then((res) => {
        if (res.data.success) {
          alert("產品刪除成功！");
          this.init();
        } else {
          alert("商品刪除失敗！");
        }
      })
      .catch((err) => {
        console.dir(err);
      })
  },
  render() {
    let statusText = "";
    let status;
    let str = "";
    this.data.products.forEach((item, index) => {
      if (item.is_enabled) {
        status = "checked";
        statusText = "啟用";
      } else {
        status = "";
        statusText = "未啟用"
      }
      str += `<tr>
    <td>${item.title}</td>
    <td>${item.category}</td>
    <td>${item.origin_price}</td>
    <td>${item.price}</td>
    <td>
      <input type="checkbox" name="enabled" id="enabled${index}" class="checkbox" data-id=${item.id} data-index="${index}" ${item.is_enabled ? "checked" : ""}>
      <label for="enabled${index}" class="btnWrap">
        <span class="btnInside"></span>
      </label>
      <span class="isEnabled">${item.is_enabled ? "啟用" : "未啟用"}</span>
    </td>
    <td><button type="button" class="deleteBtn" data-id=${item.id}>刪除</button></td>
  </tr>`;
    })
    productList.innerHTML = str;
  },
  created() {
    this.init();
    this.click();
  }
}
app.created();