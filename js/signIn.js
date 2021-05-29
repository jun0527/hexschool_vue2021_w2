const app = {
  data: {
    url: "https://vue3-course-api.hexschool.io/",
    path: "jun0527",
    user: {},
    token: "",
    expired: ""
  },
  signInClick() {
    const email = document.querySelector(".email");
    const password = document.querySelector(".password");
    const signInBtb = document.querySelector(".js-signInBtn");
    signInBtb.addEventListener("click", (e) => {
      this.data.user.username = email.value;
      this.data.user.password = password.value;
      if (email.value === "" || password.value === "") {
        alert("請填寫帳號及密碼！");
        return;
      }
      this.signIn();
    })
  },
  signIn() {
    axios.post(`${this.data.url}admin/signin`, this.data.user)
      .then((res) => {
        this.data.token = res.data.token;
        this.data.expired = res.data.expired;
        document.cookie = `signInCookie=${this.data.token}; expires=${new Date(this.data.expired)}`;
        if (res.data.success) {
          alert("登入成功！");
          window.location = "products.html";
        } else {
          alert("登入失敗，請確認帳號密碼是否正確！")
        }
        password.value = "";
      })
      .catch((err) => {
        console.dir(err);
      })
  },
  init() {
    this.signInClick();
  }
}
app.init();