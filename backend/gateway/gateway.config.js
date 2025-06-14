module.exports = {
  serviceList: [
    { name: 'auth-service', url: 'http://auth-service:8000/graphql' },
    { name: 'profiling-service', url: 'http://profiling-service:8000/graphql' },
    { name: 'vismagi-service', url: 'http://vismagi-service:8000/graphql' },
    { name: 'optimization-service', url: 'http://optimization-service:8000/graphql' },
    { name: 'simulation-service', url: 'http://simulation-service:8000/graphql' },
    { name: 'pdf-service', url: 'http://pdf-service:8000/graphql' },
  ],
};
