import { useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);

  const checkUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }

  return { user, checkUser }
}