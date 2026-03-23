import bcrypt from 'bcryptjs';
import { db, users, teams, communications } from './index.js';

async function seed() {
  console.log('🌱 开始插入种子数据...');

  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, 'admin'),
    });

    if (existingAdmin) {
      console.log('✅ 种子数据已存在，跳过');
      return;
    }

    // Create default team
    const [defaultTeam] = await db.insert(teams).values({
      name: '默认团队',
      description: '系统自动创建的默认团队',
    }).returning();

    console.log('✅ 默认团队创建成功');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminUser] = await db.insert(users).values({
      teamId: defaultTeam.id,
      username: 'admin',
      email: 'admin@foxchat.com',
      passwordHash: adminPassword,
      displayName: '管理员',
      role: 'admin',
      status: 'active',
    }).returning();

    console.log('✅ 管理员用户创建成功');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const [regularUser] = await db.insert(users).values({
      teamId: defaultTeam.id,
      username: 'user1',
      email: 'user1@foxchat.com',
      passwordHash: userPassword,
      displayName: '测试用户',
      role: 'member',
      status: 'active',
    }).returning();

    console.log('✅ 普通用户创建成功');

    // Create sample communications
    await db.insert(communications).values([
      {
        senderId: adminUser.id,
        receiverId: regularUser.id,
        type: 'message',
        content: '欢迎使用 FoxChat！这是一个团队沟通协作平台。',
      },
      {
        senderId: adminUser.id,
        teamId: defaultTeam.id,
        type: 'announcement',
        content: '🎉 团队正式成立！大家可以开始使用了。',
      },
    ]);

    console.log('✅ 示例沟通记录创建成功');

    console.log('\n📋 默认登录账号:');
    console.log('  管理员: admin / admin123');
    console.log('  普通用户: user1 / user123');
  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
    process.exit(1);
  }
}

seed();
