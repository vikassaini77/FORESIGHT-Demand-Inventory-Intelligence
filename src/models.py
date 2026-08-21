from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    role = Column(String, default="Analyst")
    phone = Column(String, default="")
    timezone = Column(String, default="PST (UTC-8)")
    company = Column(String, default="")
    job_title = Column(String, default="")
