"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var config_1 = require("@nestjs/config");
var gateway_controller_1 = require("./gateway.controller");
var GatewayModule = /** @class */ (function () {
    function GatewayModule() {
    }
    GatewayModule = __decorate([
        (0, common_1.Module)({
            controllers: [gateway_controller_1.GatewayController],
            imports: [
                config_1.ConfigModule.forRoot(),
                microservices_1.ClientsModule.register([
                    {
                        name: 'AUTH_SERVICE',
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: process.env.AUTH_SERVICE_HOST || 'localhost',
                            port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
                        },
                    },
                    {
                        name: 'EVENT_SERVICE',
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: process.env.EVENT_SERVICE_HOST || 'localhost',
                            port: parseInt(process.env.EVENT_SERVICE_PORT || '3002', 10),
                        },
                    },
                ]),
            ],
        })
    ], GatewayModule);
    return GatewayModule;
}());
exports.GatewayModule = GatewayModule;
