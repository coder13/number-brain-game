import { redis } from '../redis';
import { Room } from '../types';

export const RoomsNamespace = 'rooms';

export const setRoom = async (
  data: Room
) => {
  return await redis.set(`${RoomsNamespace}:${data.id}`, JSON.stringify(data));
};

export const getRoom = async (
  id: string
): Promise<Room | null> => {
  const room = await redis.get(`${RoomsNamespace}:${id}`);
  if (!room) {
    return null;
  }

  return JSON.parse(room);
}

export const deleteRoom = async () => { };

export const getRooms = async () => { };
