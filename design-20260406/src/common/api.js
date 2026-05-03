/**
 * 公共API请求函数
 * Common API Request Functions
 */

/**
 * API基础配置
 */
const API_CONFIG = {
  baseURL: '/api', // API基础URL，根据实际部署调整
  timeout: 10000,  // 请求超时时间（毫秒）
};

/**
 * 发送HTTP请求
 * @param {string} url - 请求URL
 * @param {object} options - 请求选项
 * @returns {Promise}
 */
async function request(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = API_CONFIG.timeout
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    if (controller.signal) {
      requestOptions.signal = controller.signal;
    }

    const response = await fetch(`${API_CONFIG.baseURL}${url}`, requestOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }

    throw error;
  }
}

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {object} params - 查询参数
 * @param {object} options - 请求选项
 * @returns {Promise}
 */
function get(url, params = {}, options = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, { ...options, method: 'GET' });
}

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} options - 请求选项
 * @returns {Promise}
 */
function post(url, data = {}, options = {}) {
  return request(url, { ...options, method: 'POST', body: data });
}

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} options - 请求选项
 * @returns {Promise}
 */
function put(url, data = {}, options = {}) {
  return request(url, { ...options, method: 'PUT', body: data });
}

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {object} options - 请求选项
 * @returns {Promise}
 */
function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' });
}

/**
 * API接口定义
 */
const API = {
  // 用户相关
  user: {
    loginByEmail: (email, code) => post('/user/login/email', { email, code }),
    loginByPhone: (phone, code) => post('/user/login/phone', { phone, code }),
    logout: () => post('/user/logout'),
    getInfo: () => get('/user/info')
  },

  // 档案相关
  profile: {
    list: () => get('/profiles'),
    create: (data) => post('/profiles', data),
    update: (id, data) => put(`/profiles/${id}`, data),
    delete: (id) => del(`/profiles/${id}`),
    setDefault: (id) => post(`/profiles/${id}/default`)
  },

  // 八字分析相关
  analysis: {
    get: (profileId) => get(`/analysis/${profileId}`),
    start: (profileId) => post(`/analysis/${profileId}/start`),
    poll: (profileId) => get(`/analysis/${profileId}/status`)
  },

  // 姻缘匹配相关
  match: {
    getResults: (profileId) => get(`/match/${profileId}`),
    start: (profileId, requirements) => post(`/match/${profileId}/start`, { requirements }),
    poll: (profileId) => get(`/match/${profileId}/status`)
  }
};

// 导出到全局
window.ApiRequest = {
  request,
  get,
  post,
  put,
  delete: del
};

window.API = API;
