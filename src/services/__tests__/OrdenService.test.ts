import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrdenService } from '../OrdenService';

// Mock fetch globally
global.fetch = vi.fn();

describe('OrdenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrden', () => {
    it('should create an order without authentication headers', async () => {
      const mockResponse = {
        ordenId: 1,
        usuarioId: 1,
        productoIds: [1, 2],
        total: 99.99,
        estado: 'PENDIENTE',
        fecha: '2025-12-07T14:00:00Z'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const ordenRequest = {
        usuarioId: 1,
        productoIds: [1, 2],
        total: 99.99,
        estado: 'PENDIENTE'
      };

      const result = await OrdenService.createOrden(ordenRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8082/v1/ordenes',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Should NOT include Authorization header for public endpoint
          },
          body: JSON.stringify({
            usuarioId: 1,
            productoIds: [1, 2],
            total: 99.99,
            estado: 'PENDIENTE',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle order creation errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      const ordenRequest = {
        usuarioId: 1,
        productoIds: [1, 2],
        total: 99.99,
        estado: 'PENDIENTE'
      };

      await expect(OrdenService.createOrden(ordenRequest)).rejects.toThrow('Error 400: Bad Request');
    });
  });

  describe('getAllOrdenes', () => {
    it('should fetch all orders without authentication', async () => {
      const mockOrders = [
        {
          ordenId: 1,
          usuarioId: 1,
          productoIds: [1, 2],
          total: 99.99,
          estado: 'PENDIENTE',
          fecha: '2025-12-07T14:00:00Z'
        }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const result = await OrdenService.getAllOrdenes();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8082/v1/ordenes',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Should NOT include Authorization header for public endpoint
          },
        })
      );

      expect(result).toEqual(mockOrders);
    });
  });
});
