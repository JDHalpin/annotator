// Example TypeScript file for annotation testing
import { EventEmitter } from 'events';

class UserManager {
  private users: Map<string, User> = new Map();
  private emitter: EventEmitter = new EventEmitter();

  constructor() {
    this.setupEventListeners();
  }

  addUser(userData: UserData): User {
    const user = new User(userData.id, userData.name, userData.email);
    this.users.set(user.id, user);
    this.emitter.emit('userAdded', user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(id: string, updates: Partial<UserData>): boolean {
    const user = this.users.get(id);
    if (!user) return false;
    
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    
    this.emitter.emit('userUpdated', user);
    return true;
  }

  private setupEventListeners(): void {
    this.emitter.on('userAdded', (user: User) => {
      console.log(`User ${user.name} added successfully`);
    });
  }
}

class User {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}

  getDisplayName(): string {
    return `${this.name} (${this.email})`;
  }

  isValid(): boolean {
    return this.id.length > 0 && this.name.length > 0 && this.email.includes('@');
  }
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export { UserManager, User, UserData };