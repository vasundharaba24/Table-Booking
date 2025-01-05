module.exports = {
  async redirects() {
    return [
      { source: '/book-table', destination: 'https://your-backend.com/book-table', permanent: false },
    ];
  },
};
