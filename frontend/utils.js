/* ========== API 工具 ========== */
const API_BASE = 'http://localhost:3000/api';

async function apiRequest(method, url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config = {
        method,
        headers,
        ...options,
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!data.success && data.error) {
        showToast(data.error.message || '请求失败', 'error');
        throw new Error(data.error.message);
    }

    return data;
}

async function apiGet(path, params = {}) {
    const qs = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const url = qs ? `${API_BASE}${path}?${qs}` : `${API_BASE}${path}`;
    return apiRequest('GET', url);
}

async function apiPost(path, body = {}) {
    return apiRequest('POST', `${API_BASE}${path}`, { body });
}

async function apiPut(path, body = {}) {
    return apiRequest('PUT', `${API_BASE}${path}`, { body });
}

async function apiDelete(path, params = {}) {
    const qs = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const url = qs ? `${API_BASE}${path}?${qs}` : `${API_BASE}${path}`;
    return apiRequest('DELETE', url);
}

/* ========== 用户管理 ========== */
function getCurrentUser() {
    const raw = localStorage.getItem('cc_user');
    return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('cc_user', JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem('cc_user');
    window.location.href = 'login.html';
}

function requireAuth() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/* ========== 消息提示 ========== */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* ========== 分页工具 ========== */
function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';

    html += `<button class="page-btn" ${currentPage <= 1 ? 'disabled' : ''} onclick="onPageBtn(${currentPage - 1})">‹</button>`;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (start > 1) html += `<button class="page-btn" onclick="onPageBtn(1)">1</button>`;
    if (start > 2) html += `<span style="color:#546e7a;padding:0 4px;">...</span>`;

    for (let i = start; i <= end; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="onPageBtn(${i})">${i}</button>`;
    }

    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span style="color:#546e7a;padding:0 4px;">...</span>`;
        html += `<button class="page-btn" onclick="onPageBtn(${totalPages})">${totalPages}</button>`;
    }

    html += `<button class="page-btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="onPageBtn(${currentPage + 1})">›</button>`;
    html += `<span class="page-info">第 ${currentPage} / ${totalPages} 页</span>`;

    container.innerHTML = html;

    window.onPageBtn = (p) => {
        if (p >= 1 && p <= totalPages) onPageChange(p);
    };
}

/* ========== 格式化 ========== */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

function formatDateShort(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
}

function statusBadge(val) {
    const on = ['1', 1, 'true', true];
    if (on.includes(val)) return '<span class="badge badge-success">开</span>';
    return '<span class="badge" style="background:rgba(158,158,158,0.15);color:#9e9e9e;">关</span>';
}