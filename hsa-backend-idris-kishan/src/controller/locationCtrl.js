import Location from '../models/Location';
import Service from '../models/Service';

export const locationTracker = async (socket, service_id, room, track) => {

    socket.on('gettingPosition', async (data) => {
        let longitude = data.coordinates.longitude, latitude = data.coordinates.latitude;
        console.log('lat log from location tracker :', { longitude, latitude });

        let datum = {
            longitude, latitude
        };

        track.in(room).emit('emittingPosition', datum);

        await Location.findOne({ service_id: service_id })
            .then(async (doc) => {
                if (doc) {

                    // TODO: keep pushing the updated coordinates
                    let location = {
                        coordinates: [data.coordinates.longitude, data.coordinates.latitude],
                        type: 'point'
                    };
                    doc.current_coordinates.push(location);
                    await doc.save();

                } else {
                    console.log('Creating new Location~~~~');

                    // TODO: Initial location doc to be created
                    const service = await Service.findById(service_id).populate('service_provider_id', ['device_id', 'addresses']).populate('customer_id', ['device_id', 'addresses']);
                    console.log(service.service_provider_id.addresses[0].location.coordinates);
                    let start_location = {
                        location: {
                            coordinates: service.service_provider_id.addresses[0].location.coordinates,
                            type: 'point'
                        }
                    };
                    let end_location = {
                        location: {
                            coordinates: [service.longitude, service.latitude],
                            type: 'point'
                        }
                    };
                    const location = new Location({
                        service_id: service._id,
                        start_location_coordinates: [start_location], // current coordinate of the provider
                        end_location_coordinates: [end_location],  // coordinate for the requested service location
                    });
                    await location.save();
                }
            })
            .catch((err) => {
                if (err && err.code === 11000) {
                    return null;
                }
                console.log('Error form Location doc---', err);
            });
    });

    // On disconnection
    socket.on('disconnect', () => {
        socket.leave('room-' + socket.handshake.query.service_id);
        console.log(`Connection ${socket.id} has left the socket-connection`);
    });
};