'use strict';

import formatResponse from '../../utils/formatResponse';

export const ListOfCities = async (req, res) => {
    const cities = [
        {
            position: 1,
            value: 'Abhā',
            label: 'Abhā',
            name: 'Abhā'
        },
        {
            position: 2,
            value: 'Ad Dammām',
            label: 'Ad Dammām',
            name: 'Ad Dammām'
        },
        {
            position: 3,
            value: 'Al Bāḩah',
            label: 'Al Bāḩah',
            name: 'Al Bāḩah'
        },
        {
            position: 4,
            value: 'Al Hufūf',
            label: 'Al Hufūf',
            name: 'Al Hufūf'
        },
        {
            position: 5,
            value: 'Al Kharj',
            label: 'Al Kharj',
            name: 'Al Kharj'
        },
        {
            position: 6,
            value: 'Al Mubarraz',
            label: 'Al Mubarraz',
            name: 'Al Mubarraz'
        },
        {
            position: 7,
            value: 'Al Qaţīf',
            label: 'Al Qaţīf',
            name: 'Al Qaţīf'
        },
        {
            position: 8,
            value: 'Al Ḩillah',
            label: 'Al Ḩillah',
            name: 'Al Ḩillah'
        },
        {
            position: 9,
            value: '‘Ar‘ar',
            label: '‘Ar‘ar',
            name: '‘Ar‘ar'
        },
        {
            position: 10,
            value: 'Aţ Ţā’if',
            label: 'Aţ Ţā’if',
            name: 'Aţ Ţā’if'
        },
        {
            position: 11,
            value: 'Buraydah',
            label: 'Buraydah',
            name: 'Buraydah'
        },
        {
            position: 12,
            value: 'Ḩā’il',
            label: 'Ḩā’il',
            name: 'Ḩā’il'
        },
        {
            position: 13,
            value: 'Jeddah',
            label: 'Jeddah',
            name: 'Jeddah'
        },
        {
            position: 14,
            value: 'Jāzān',
            label: 'Jāzān',
            name: 'Jāzān'
        },
        {
            position: 15,
            value: 'Khamīs Mushayţ',
            label: 'Khamīs Mushayţ',
            name: 'Khamīs Mushayţ'
        },
        {
            position: 16,
            value: 'Mecca',
            label: 'Mecca',
            name: 'Mecca'
        },
        {
            position: 17,
            value: 'Medina',
            label: 'Medina',
            name: 'Medina'
        },
        {
            position: 18,
            value: 'Najrān',
            label: 'Najrān',
            name: 'Najrān'
        },
        {
            position: 19,
            value: 'Riyadh',
            label: 'Riyadh',
            name: 'Riyadh'
        },
        {
            position: 20,
            value: 'Sakākā',
            label: 'Sakākā',
            name: 'Sakākā'
        },
        {
            position: 21,
            value: 'Tabūk',
            label: 'Tabūk',
            name: 'Tabūk'
        }
    ];
    formatResponse(res, cities);
};
