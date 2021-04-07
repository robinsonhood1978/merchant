const adminId = 'admin_id';

export function getAdminId() {
  return sessionStorage.getItem(adminId);
}
export function setInfo(userid) {
    return sessionStorage.setItem(adminId, userid);
}
export function removeInfo() {
  return sessionStorage.removeItem(adminId);
}

