"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ROOM_DELETED = exports.EVENT_ROOM_UPDATED = exports.EVENT_ROOM_CREATED = exports.roomFilterableFields = exports.roomSearchableFields = void 0;
exports.roomSearchableFields = ['roomNumber', 'floor'];
exports.roomFilterableFields = [
    'searchTerm',
    'roomNumber',
    'floor',
    'buildingId',
];
exports.EVENT_ROOM_CREATED = 'room.created';
exports.EVENT_ROOM_UPDATED = 'room.updated';
exports.EVENT_ROOM_DELETED = 'room.deleted';
