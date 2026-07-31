import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export type UserRole = 'admin' | 'customer';

export interface NotionUser {
  id: string;
  notionPageId: string;
  name: string;
  email: string;
  googleId: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Cari user berdasarkan email di Notion Users Database.
 */
export async function getUserByEmail(email: string): Promise<NotionUser | null> {
  const databaseId = process.env.NOTION_USERS_DATABASE_ID;
  if (!databaseId) return null;

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: {
        property: 'Email',
        email: { equals: email },
      },
    });

    if (response.results.length === 0) return null;

    return mapNotionPageToUser(response.results[0]);
  } catch (error) {
    console.error('[notion-users] getUserByEmail error:', error);
    return null;
  }
}

/**
 * Buat user baru di Notion Users Database.
 */
export async function createUser(data: {
  name: string;
  email: string;
  googleId: string;
  role?: UserRole;
}): Promise<NotionUser | null> {
  const databaseId = process.env.NOTION_USERS_DATABASE_ID;
  if (!databaseId) return null;

  try {
    const page = await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: data.name } }],
        },
        Email: {
          email: data.email,
        },
        GoogleId: {
          rich_text: [{ text: { content: data.googleId } }],
        },
        Role: {
          select: { name: data.role ?? 'customer' },
        },
        CreatedAt: {
          date: { start: new Date().toISOString() },
        },
      },
    });

    return mapNotionPageToUser(page);
  } catch (error) {
    console.error('[notion-users] createUser error:', error);
    return null;
  }
}

/**
 * Ambil atau buat user saat login Google OAuth.
 */
export async function getOrCreateUser(data: {
  name: string;
  email: string;
  googleId: string;
}): Promise<NotionUser | null> {
  const existing = await getUserByEmail(data.email);
  if (existing) return existing;
  return createUser(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotionPageToUser(page: any): NotionUser {
  const props = page.properties;
  return {
    id: page.id,
    notionPageId: page.id,
    name: props.Name?.title?.[0]?.plain_text ?? '',
    email: props.Email?.email ?? '',
    googleId: props.GoogleId?.rich_text?.[0]?.plain_text ?? '',
    role: (props.Role?.select?.name as UserRole) ?? 'customer',
    createdAt: props.CreatedAt?.date?.start ?? '',
  };
}
