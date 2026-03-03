import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type { NewProductInput, Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { db, firebaseConfigError } from '../firebase/config';

const collectionName = 'products';

export class FirestoreProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const firestore = this.ensureDbReady();

    try {
      const productsQuery = query(
        collection(firestore, collectionName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(productsQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.();

        return {
          id: doc.id,
          name: data.name as string,
          imageUrl: data.imageUrl as string,
          linkUrl: (data.linkUrl ?? data.shopeeUrl ?? data.tiktokUrl ?? '') as string,
          createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString()
        };
      });
    } catch (error) {
      throw this.toReadableError(error);
    }
  }

  async createProduct(input: NewProductInput): Promise<void> {
    const firestore = this.ensureDbReady();

    try {
      await addDoc(collection(firestore, collectionName), {
        ...input,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      throw this.toReadableError(error);
    }
  }

  private toReadableError(error: unknown): Error {
    if (!(error instanceof FirebaseError)) {
      return new Error('Lỗi không xác định khi gọi Firebase.');
    }

    switch (error.code) {
      case 'permission-denied':
        return new Error(
          'Firestore đang chặn quyền đọc/ghi (permission-denied). Kiểm tra Firestore Rules.'
        );
      case 'unauthenticated':
        return new Error('Yêu cầu đăng nhập để ghi dữ liệu vào Firestore.');
      case 'unavailable':
        return new Error('Firebase tạm thời không khả dụng. Thử lại sau.');
      case 'invalid-argument':
        return new Error('Dữ liệu gửi lên Firestore không hợp lệ.');
      default:
        return new Error(`Firebase error: ${error.code}`);
    }
  }

  private ensureDbReady() {
    if (!db) {
      throw new Error(firebaseConfigError ?? 'Firebase chưa được khởi tạo.');
    }

    return db;
  }
}
