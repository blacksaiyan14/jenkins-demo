import { UseAxios } from "../api";
import axios from "axios";
 const EditAction = async ({request}) => {
    // const {axiosInstance}= UseAxios();
    let formdata = await request.formData();
    try{
        const form = {
            username: formdata.get('username'),
            email: formdata.get('email'),
            first_name: formdata.get('first_name'),
            last_name: formdata.get('last_name')
        }
        const response = await axios.put('http://127.0.0.1:8000/api/update-profile/', form, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
        });
        
     return response.data.data 
    }
    catch(err){
        console.error(err)
    }
}
export default EditAction;