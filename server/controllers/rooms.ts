import { redis } from '../redis';

const RoomsNamespace = 'rooms';

export const createRoom = async (
  data: { name: string, id: string }
) => {
  redis.set(`${RoomsNamespace}:${data.id}`, JSON.stringify(data));
};

export const deleteRoom = async () => { };

export const getRooms = async () => { };
