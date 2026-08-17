"""Spec section 5 — YouTube learning resources."""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    video_title = Column(String)
    channel_name = Column(String)
    duration = Column(String)
    video_url = Column(String)  # set via YouTube Data API or admin panel; never fabricated

    topic = relationship("Topic", back_populates="resources")
