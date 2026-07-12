"""add_social_gamification_models

Revision ID: ea73e1ae31c7
Revises: 2345678901bc
Create Date: 2026-07-12 13:29:42.138700

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea73e1ae31c7'
down_revision: Union[str, Sequence[str], None] = '2345678901bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Social Models ---
    op.create_table('departments',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('company_id', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_departments_id'), 'departments', ['id'], unique=False)
    op.create_index(op.f('ix_departments_company_id'), 'departments', ['company_id'], unique=False)

    op.create_table('employees',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('department_id', sa.UUID(), nullable=True),
        sa.Column('company_id', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_employees_id'), 'employees', ['id'], unique=False)
    op.create_index(op.f('ix_employees_company_id'), 'employees', ['company_id'], unique=False)
    op.create_index(op.f('ix_employees_department_id'), 'employees', ['department_id'], unique=False)

    op.create_table('employee_wellbeing',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=False),
        sa.Column('survey_date', sa.Date(), nullable=False),
        sa.Column('satisfaction_score', sa.Float(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_employee_wellbeing_id'), 'employee_wellbeing', ['id'], unique=False)
    op.create_index(op.f('ix_employee_wellbeing_employee_id'), 'employee_wellbeing', ['employee_id'], unique=False)
    op.create_index(op.f('ix_employee_wellbeing_survey_date'), 'employee_wellbeing', ['survey_date'], unique=False)

    op.create_table('csr_initiatives',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('budget', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('beneficiaries', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('responsible_id', sa.UUID(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['responsible_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_csr_initiatives_id'), 'csr_initiatives', ['id'], unique=False)
    op.create_index(op.f('ix_csr_initiatives_responsible_id'), 'csr_initiatives', ['responsible_id'], unique=False)
    op.create_index(op.f('ix_csr_initiatives_start_date'), 'csr_initiatives', ['start_date'], unique=False)
    op.create_index(op.f('ix_csr_initiatives_status'), 'csr_initiatives', ['status'], unique=False)

    op.create_table('diversity_metrics',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('period', sa.String(length=50), nullable=False),
        sa.Column('department_id', sa.UUID(), nullable=False),
        sa.Column('gender_ratio', sa.Float(), nullable=False),
        sa.Column('inclusion_score', sa.Float(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_diversity_metrics_id'), 'diversity_metrics', ['id'], unique=False)
    op.create_index(op.f('ix_diversity_metrics_department_id'), 'diversity_metrics', ['department_id'], unique=False)
    op.create_index(op.f('ix_diversity_metrics_period'), 'diversity_metrics', ['period'], unique=False)

    # --- Gamification Models ---
    op.create_table('badges',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('criteria', sa.Text(), nullable=False),
        sa.Column('icon', sa.String(length=255), nullable=False),
        sa.Column('points_value', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_badges_id'), 'badges', ['id'], unique=False)
    op.create_index(op.f('ix_badges_name'), 'badges', ['name'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_badges_name'), table_name='badges')
    op.drop_index(op.f('ix_badges_id'), table_name='badges')
    op.drop_table('badges')

    op.drop_index(op.f('ix_diversity_metrics_period'), table_name='diversity_metrics')
    op.drop_index(op.f('ix_diversity_metrics_department_id'), table_name='diversity_metrics')
    op.drop_index(op.f('ix_diversity_metrics_id'), table_name='diversity_metrics')
    op.drop_table('diversity_metrics')

    op.drop_index(op.f('ix_csr_initiatives_status'), table_name='csr_initiatives')
    op.drop_index(op.f('ix_csr_initiatives_start_date'), table_name='csr_initiatives')
    op.drop_index(op.f('ix_csr_initiatives_responsible_id'), table_name='csr_initiatives')
    op.drop_index(op.f('ix_csr_initiatives_id'), table_name='csr_initiatives')
    op.drop_table('csr_initiatives')

    op.drop_index(op.f('ix_employee_wellbeing_survey_date'), table_name='employee_wellbeing')
    op.drop_index(op.f('ix_employee_wellbeing_employee_id'), table_name='employee_wellbeing')
    op.drop_index(op.f('ix_employee_wellbeing_id'), table_name='employee_wellbeing')
    op.drop_table('employee_wellbeing')

    op.drop_index(op.f('ix_employees_department_id'), table_name='employees')
    op.drop_index(op.f('ix_employees_company_id'), table_name='employees')
    op.drop_index(op.f('ix_employees_id'), table_name='employees')
    op.drop_table('employees')

    op.drop_index(op.f('ix_departments_company_id'), table_name='departments')
    op.drop_index(op.f('ix_departments_id'), table_name='departments')
    op.drop_table('departments')
