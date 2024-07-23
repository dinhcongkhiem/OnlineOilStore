import axios from "axios";
const ADDRESS_API_URL = process.env.REACT_APP_API_ADDRESS_URL;
class DataAddressClass {
getDataAddress = (type, id) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${ADDRESS_API_URL}${type}/${id}.htm`
    };

    return axios.request(config)
        .then(response => {
            const options = response.data.data.map(item => ({
                value: item.id,
                label: item.name
            }));
            return options;
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            throw error;
        });
}
}
const DataAddress = new DataAddressClass();
export default DataAddress;