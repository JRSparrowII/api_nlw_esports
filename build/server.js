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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const convert_hours_string_to_minutes_1 = require("./utils/convert-hours-string-to-minutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient({
    log: ['query']
});
app.get('/games', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    });
    return response.json(games);
}));
app.post('/games/:id/ads', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = request.params.id;
    const body = request.body;
    const ad = yield prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: (0, convert_hours_string_to_minutes_1.convertHoursStringToMinutes)(body.hourStart),
            hourEnd: (0, convert_hours_string_to_minutes_1.convertHoursStringToMinutes)(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    });
    return response.status(201).json(ad);
}));
app.get('/games/:id/ads', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = request.params.id;
    const ads = yield prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourEnd: true,
            hourStart: true,
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return response.json(ads.map(ad => {
        return Object.assign(Object.assign({}, ad), { weekDays: ad.weekDays.split(',') });
    }));
}));
app.get('/ads', (request, response) => {
    return response.json([
        { id: '1', name: 'John', },
        { id: '2', name: 'Henrique', },
        { id: '3', name: 'Prisco', },
        { id: '4', name: 'Edivania', },
    ]);
});
app.get('/ads/:id/discord', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const adId = request.params.id;
    const ad = yield prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    });
    return response.json({
        discord: ad.discord
    });
}));
app.get('/transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield prisma.transaction.findMany();
    return res.json(transactions);
}));
app.listen(3333);
