from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    organization_name = db.Column(db.String, nullable=False)
    event_name = db.Column(db.String, nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String)
    maps_link = db.Column(db.String)
    online = db.Column(db.Boolean, default=False)
    event_link = db.Column(db.String)

    intl = db.relationship("EventIntl", backref="event", cascade="all, delete")
    tags = db.relationship("Tag", secondary="event_tags", back_populates="events")


class EventIntl(db.Model):
    __tablename__ = "event_intl"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"))
    lang = db.Column(db.String, nullable=False)
    event_edition = db.Column(db.String)
    cost = db.Column(db.String)
    banner_link = db.Column(db.String)
    short_description = db.Column(db.String)


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    events = db.relationship("Event", secondary="event_tags", back_populates="tags")


class EventTag(db.Model):
    __tablename__ = "event_tags"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"))
    tag_id = db.Column(db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"))

    __table_args__ = (db.UniqueConstraint("event_id", "tag_id"),)
