import { _get,_put, _post } from './index';

//注册
export const register = data => {
  let req = {
    data,
    url: `admin/admin_register`
  };
  return _post(req);
};
//登录
export const login = data => {
  let req = {
    data,
    url: 'admin/admin_login'
  };
  return _post(req);
};

//修改密码
export const adminChangePassword = data => {
  let req = {
    data,
    url: 'admin/admin_change_password'
  };
  return _post(req);
};

//登录
export const loginPhone = data => {
  let req = {
    data,
    url: 'admin/admin_login_phone'
  };
  return _post(req);
};

//忘记密码
export const forgetPassword = data => {
  let req = {
    data,
    url: 'admin/forget_password'
  };
  return _post(req);
};

//获取验证码
export const getVerify = data => {
  let req = {
    data,
    url: 'admin/admin_verify'
  };
  return _get(req);
};

//登出
export const logout = () => {
  let req = {
    url: 'admin/admin_logout'
  };
  sessionStorage.clear();
  return _post(req);
};

//获取商户信息
export const getMyInfo = data => {
  let req = {
    data,
    url: 'admin/admin_info'
  };
  return _get(req);
};

//提现
export const withdraw = data => {
  let req = {
    data,
    url: 'admin/withdraw'
  };
  return _post(req);
};

export const getAdvertises = data => {
  let req = {
    data,
    url: 'admin/my_advertisings'
  };
  return _get(req);
};

export const addAdvertise = data => {
  let req = {
    data,
    url: 'manage/advertising'
  };
  return _post(req);
};

export const getAdvertise = data => {
  let req = {
    url: 'manage/advertising/'+data
  };
  return _get(req);
};

export const updateAdvertising = data => {
  const req = {
    data,
    url: `manage/advertising/${data.id}`
  };
  return _put(req);
};

export const updatePic = data => {
  const req = {
    data,
    url: `manage/update_pic/${data.advertising_id}`
  };
  return _put(req);
};

export const updateAdvertisePhotos = data => {
  let req = {
    data,
    url: `manage/advertising_photos/${data.advertising_id}`
  };
  return _put(req);
};
//下订单
export const makeOrder = data => {
  let req = {
    data,
    url: 'admin/order'
  };
  return _post(req);
};
//得到本商户全部订单
export const myOrders = data => {
  let req = {
    data,
    url: 'admin/my_orders'
  };
  return _get(req);
};
//单个订单
export const myOrder = data => {
  let req = {
    data,
    url: `admin/order/${data.id}`
  };
  return _get(req);
};
//pay
export const pay = data => {
  let req = {
    data,
    url: 'admin/pay'
  };
  return _post(req);
};