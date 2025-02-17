const { test, expect } = require('@playwright/test');

test.describe('API Tests for /customers endpoint', () => {
  // const baseUrl = process.env.API_BASE_URL;
  const baseUrl = 'http://localhost:3001'

  test.describe('Successful requests', () => {
    test('retrieves customers with default query parameters', async ({ request }) => {
      // Arrange
      const expectedStatus = 200;

      // Act
      const response = await request.get(`${baseUrl}/customers`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      const { customers, pageInfo } = responseBody;
      expect(Array.isArray(customers)).toBeTruthy();
      expect(typeof pageInfo).toBe('object');
      customers.forEach(customer => {
        expect(customer).toHaveProperty('id');
        expect(customer).toHaveProperty('name');
        expect(customer).toHaveProperty('employees');
        expect(customer).toHaveProperty('contactInfo');
        expect(customer).toHaveProperty('size');
        expect(customer).toHaveProperty('industry');
        expect(customer).toHaveProperty('address');
      });
    });

    test('retrieves customers with size filter', async ({ request }) => {
      // Arrange
      const expectedStatus = 200;
      const size = 'Medium';

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      const { customers } = responseBody;
      customers.forEach(customer => {
        expect(customer.size).toBe(size);
        expect(customer.employees).toBeGreaterThanOrEqual(100);
        expect(customer.employees).toBeLessThan(1000);
      });
    });

    test('retrieves customers with industry filter', async ({ request }) => {
      // Arrange
      const expectedStatus = 200;
      const industry = 'Technology';

      // Act
      const response = await request.get(`${baseUrl}/customers?industry=${industry}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      const { customers } = responseBody;
      customers.forEach(customer => {
        expect(customer.industry).toBe(industry);
      });
    });

    test('retrieves customers with pagination', async ({ request }) => {
      // Arrange
      const expectedStatus = 200;
      const page = 2;
      const limit = 5;

      // Act
      const response = await request.get(`${baseUrl}/customers?page=${page}&limit=${limit}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      const { customers, pageInfo } = responseBody;
      expect(pageInfo.currentPage).toBe(page);
      expect(customers.length).toBeLessThanOrEqual(limit);
    });
  });

  test.describe('Error scenarios', () => {
    test('returns 400 for invalid page parameter (negative)', async ({ request }) => {
      // Arrange
      const expectedStatus = 400;
      const page = -1;

      // Act
      const response = await request.get(`${baseUrl}/customers?page=${page}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      expect(responseBody.error).toBe('Invalid page or limit. Both must be positive numbers.');
    });

    test('returns 400 for invalid limit parameter (zero)', async ({ request }) => {
      // Arrange
      const expectedStatus = 400;
      const limit = 0;

      // Act
      const response = await request.get(`${baseUrl}/customers?limit=${limit}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      expect(responseBody.error).toBe('Invalid page or limit. Both must be positive numbers.');
    });

    test('returns 400 for unsupported size value', async ({ request }) => {
      // Arrange
      const expectedStatus = 400;
      const size = 'Gigantic';

      // Act
      const response = await request.get(`${baseUrl}/customers?size=${size}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      expect(responseBody.error).toBe('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.');
    });

    test('returns 400 for unsupported industry value', async ({ request }) => {
      // Arrange
      const expectedStatus = 400;
      const industry = 'Agriculture';

      // Act
      const response = await request.get(`${baseUrl}/customers?industry=${industry}`);
      const responseBody = await response.json();

      // Assert
      expect(response.status()).toBe(expectedStatus);
      expect(responseBody.error).toBe('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.');
    });
  });
});
