"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOutboxPoller = void 0;
const prisma_1 = require("../../shared/prisma");
const redis_1 = require("../../shared/redis");
const client_1 = require("@prisma/client");
const POLLING_INTERVAL_MS = 5000;
const processOutboxEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingEvents = yield prisma_1.prisma.outbox.findMany({
            where: {
                status: client_1.OutboxEventStatus.PENDING,
            },
            take: 50,
            orderBy: {
                createdAt: 'asc',
            },
        });
        for (const event of pendingEvents) {
            try {
                yield redis_1.RedisClient.publish(event.eventType, event.payload);
                yield prisma_1.prisma.outbox.update({
                    where: { id: event.id },
                    data: { status: client_1.OutboxEventStatus.PUBLISHED },
                });
            }
            catch (publishError) {
                console.error(`Failed to publish event (ID: ${event.id}):`, publishError);
            }
        }
    }
    catch (error) {
        console.error('Error in outbox poller:', error);
    }
});
const startOutboxPoller = () => {
    setInterval(processOutboxEvents, POLLING_INTERVAL_MS);
    // console.log(`Outbox poller started (interval: ${POLLING_INTERVAL_MS}ms)`);
};
exports.startOutboxPoller = startOutboxPoller;
