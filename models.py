import os
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta

db = SQLAlchemy()


class User(db.Model):
    """User model for storing user data"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)  # 'admin' or 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        """Hash and set the user password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify the password against the hash"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update the last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<User {self.username}>'


class Task(db.Model):
    """Task model for user assignments"""
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending|done
    view_status = db.Column(db.String(20), default='send', nullable=False)  # send|seen
    viewed_at = db.Column(db.DateTime, nullable=True)
    admin_locked = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = db.Column(db.DateTime, nullable=True)

    assigned_to_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    assigned_to = db.relationship('User', foreign_keys=[assigned_to_id], backref='tasks_assigned')
    created_by = db.relationship('User', foreign_keys=[created_by_id], backref='tasks_created')

    def is_overdue(self):
        return self.status != 'done' and self.due_date < date.today()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat(),
            'status': self.status,
            'view_status': self.view_status,
            'viewed_at': self.viewed_at.isoformat() if self.viewed_at else None,
            'admin_locked': self.admin_locked,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'assigned_to': {
                'id': self.assigned_to_id,
                'username': self.assigned_to.username if self.assigned_to else None,
                'role': self.assigned_to.role if self.assigned_to else None,
            },
            'created_by': {
                'id': self.created_by_id,
                'username': self.created_by.username if self.created_by else None,
                'role': self.created_by.role if self.created_by else None,
            },
            'overdue': self.is_overdue(),
        }


class TaskAttachment(db.Model):
    """File attachments for tasks"""
    __tablename__ = 'task_attachments'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    stored_path = db.Column(db.String(255), nullable=False)
    uploaded_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    task = db.relationship('Task', backref='attachments')
    uploaded_by = db.relationship('User')

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'stored_path': self.stored_path,
            'uploaded_by_id': self.uploaded_by_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Mail(db.Model):
    """Simple mailbox message"""
    __tablename__ = 'mails'

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_draft = db.Column(db.Boolean, default=False, nullable=False)
    is_saved = db.Column(db.Boolean, default=False, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)

    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_mails')
    recipient = db.relationship('User', foreign_keys=[recipient_id], backref='received_mails')

    def to_dict(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'body': self.body,
            'sender': self.sender.username if self.sender else 'System',
            'recipient_id': self.recipient_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_draft': self.is_draft,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None,
        }
