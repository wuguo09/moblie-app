export const message = {
  toast(title: string, type = "text") {
    // if (title.length > 15) {
    //   console.error("toast长度超过15个字符,当前长度为" + title.length);
    //   return;
    // }
    let icon: UniApp.ShowToastOptions["icon"] = "none";
    if (type) {
      switch (type) {
        case "text":
          icon = "none";
          break;
        case "suc":
          icon = "success";
          break;
        case "err":
          icon = "error";
          break;
      }
    }
    uni.showToast({
      title,
      icon,
    });
  },
  confirm(title: string, confirmColor: string) {
    return new Promise((res, rej) => {
      uni.showModal({
        title,
        cancelColor: "#b6b6b6",
        confirmColor: confirmColor,
        success: (result) => {
          if (result.cancel) {
            rej(result);
          } else if (result.confirm) {
            res(result);
          }
        },
      });
    });
  },
  async message(content: string, confirmColor: string) {
    return new Promise((res) => {
      uni.showModal({
        title: "提示",
        content,
        showCancel: false,
        confirmColor,
        success: (result) => {
          res(result);
        },
      });
    });
  },
};

// export default message