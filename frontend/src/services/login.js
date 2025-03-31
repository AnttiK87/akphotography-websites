//HTTP reguests for handling user login

//dependencies
import axios from 'axios'

const baseUrl = '/api/login'

// login uset
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

// exports
export default { login }
