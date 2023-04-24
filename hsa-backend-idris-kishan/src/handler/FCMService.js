import axios from 'axios';

export const firebaseNotificationToUserApp = async (data) => {
    console.log(data);


    const url = 'https://fcm.googleapis.com/fcm/send';
    const headers = {
        'Authorization': 'key=AAAAb7Y1RvA:APA91bHamSNlZZso5BibrjiE3vmMgjpT6SDPjSmpHdZ6ZZR4St8-VLD8T-RP3jgdxqz_RHJMnbJ0ZfAhdK6ZTAaXD1lUTDX8XQ10KoEbdz3hRvl-LRV0EB5T7mLjbVdle9YQ7mg2OfTW'
    };

    const options = {
        method: 'POST',
        headers: headers,
        data: data,
        url
    };
    return await axios(options);
};

export const firebaseNotificationToProviderApp = async (data) => {

    const url = 'https://fcm.googleapis.com/fcm/send';
    const headers = {
        'Authorization': 'key=AAAAl61tfAM:APA91bHO76mOcIwykDjNmR8ZclIP6X4wogvvUI-ORX8Yo5RWUFsd6ng4moz5K5_Za8FeNY6e0613J6qL3tfwgCwUUwzrtmQMJB5m3HSnR9lG1tDV8zEHR2NJ7UQvI7wleMTpGQ4PSOAw'
    };

    const options = {
        method: 'POST',
        headers: headers,
        data: data,
        url
    };
    return await axios(options);
};