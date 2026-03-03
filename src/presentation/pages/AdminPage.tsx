import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  firebaseConfigError,
  firebaseProjectId,
  missingFirebaseKeys
} from '../../infrastructure/firebase/config';
import { Header } from '../components/Header';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useProducts } from '../hooks/useProducts';

const initialForm = {
  name: '',
  imageUrl: '',
  linkUrl: ''
};

export function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [successText, setSuccessText] = useState<string | null>(null);
  const { createProduct, isCreating, error } = useProducts();
  const {
    user,
    isAuthLoading,
    authError,
    isAuthenticated,
    isAdminEmailConfigured,
    signInWithEmailPassword,
    signOut
  } = useFirebaseAuth();

  const isSubmitDisabled = isCreating || !isAuthenticated;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessText(null);

    if (!isAuthenticated) {
      return;
    }

    try {
      await createProduct(form);
      setForm(initialForm);
      setSuccessText('Đã thêm sản phẩm thành công.');
    } catch {
      // Handled by hook state.
    }
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginSubmitting(true);
    try {
      await signInWithEmailPassword(loginForm.email, loginForm.password);
      setLoginForm({ email: '', password: '' });
      setIsLoginOpen(false);
    } catch {
      // Error is shown via authError.
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  return (
    <main className="page-wrap">
      <Header
        title="Product Admin"
        subtitle="Đẩy sản phẩm lên Firebase để hiển thị ở web link-bio."
        actionLabel="Xem trang link-bio"
        actionPath="/"
      />

      <form className="admin-form" onSubmit={submit}>
        <div className={`connection-status ${firebaseConfigError ? 'bad' : 'good'}`}>
          <p>
            Firebase project: <strong>{firebaseProjectId}</strong>
          </p>
          {firebaseConfigError ? (
            <p>Config lỗi: thiếu {missingFirebaseKeys.join(', ')}</p>
          ) : (
            <p>Config Firebase hợp lệ, sẵn sàng ghi vào collection `products`.</p>
          )}
        </div>

        <div className={`connection-status ${isAuthenticated ? 'good' : 'bad'}`}>
          {isAuthLoading ? (
            <p>Đang kiểm tra phiên đăng nhập...</p>
          ) : isAuthenticated ? (
            <p>
              Đã đăng nhập: <strong>{user?.email ?? user?.displayName ?? 'Unknown user'}</strong>
            </p>
          ) : (
            <p>Chưa đăng nhập. Bạn cần đăng nhập để ghi dữ liệu.</p>
          )}

          <div className="auth-actions">
            {!isAuthenticated ? (
              <button
                className="ghost-btn auth-btn"
                type="button"
                onClick={() => setIsLoginOpen(true)}
                disabled={isAuthLoading || Boolean(firebaseConfigError) || !isAdminEmailConfigured}
              >
                Đăng nhập
              </button>
            ) : (
              <button className="ghost-btn auth-btn" type="button" onClick={() => void signOut()}>
                Đăng xuất
              </button>
            )}
          </div>
        </div>

        <label>
          Tên sản phẩm
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Ví dụ: Son tint bóng"
            disabled={!isAuthenticated}
          />
        </label>

        <label>
          Ảnh sản phẩm (URL)
          <input
            required
            type="url"
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            placeholder="https://..."
            disabled={!isAuthenticated}
          />
        </label>

        <label>
          Link sản phẩm
          <input
            required
            type="url"
            value={form.linkUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, linkUrl: event.target.value }))}
            placeholder="https://..."
            disabled={!isAuthenticated}
          />
        </label>

        <button className="submit-btn" type="submit" disabled={isSubmitDisabled}>
          {isCreating ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>

        {error && <p className="state-text error">{error}</p>}
        {authError && <p className="state-text error">{authError}</p>}
        {successText && <p className="state-text success">{successText}</p>}
      </form>

      {isLoginOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Đăng nhập admin</h2>
            <form onSubmit={submitLogin}>
              <label>
                Email
                <input
                  required
                  type="email"
                  autoComplete="username"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="admin@example.com"
                />
              </label>
              <label>
                Mật khẩu
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder="••••••••"
                />
              </label>
              <div className="login-actions">
                <button className="ghost-btn auth-btn" type="button" onClick={() => setIsLoginOpen(false)}>
                  Hủy
                </button>
                <button className="submit-btn" type="submit" disabled={isLoginSubmitting}>
                  {isLoginSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
