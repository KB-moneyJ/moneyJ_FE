import type { UserMe } from './types';

const KEY = 'me.public';

export type MePublic = Pick<UserMe, 'nickname' | 'email' | 'profileImage'>;

export function loadMeFromStorage(): MePublic | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const me: MePublic = {
      nickname: parsed?.nickname ?? '',
      email: parsed?.email ?? '',
      profileImage: parsed?.profileImage ?? undefined,
    };
    return me;
  } catch {
    return undefined;
  }
}

export function saveMeToStorage(me: UserMe | MePublic | undefined) {
  if (!me) return;
  const toSave: MePublic = {
    nickname: me.nickname,
    email: me.email,
    profileImage: me.profileImage,
  };
  localStorage.setItem(KEY, JSON.stringify(toSave));
}

export function clearMeStorage() {
  localStorage.removeItem(KEY);
}
