export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    if (password.length > 128) {
        return { valid: false, message: 'Password must be less than 128 characters' };
    }
    return { valid: true, message: '' };
};

export const validateName = (name: string): { valid: boolean; message: string } => {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters long' };
    }
    if (name.trim().length > 100) {
        return { valid: false, message: 'Name must be less than 100 characters' };
    }
    return { valid: true, message: '' };
};

export const validateTaskTitle = (title: string): { valid: boolean; message: string } => {
    if (!title || title.trim().length === 0) {
        return { valid: false, message: 'Task title is required' };
    }
    if (title.trim().length > 255) {
        return { valid: false, message: 'Task title must be less than 255 characters' };
    }
    return { valid: true, message: '' };
};
