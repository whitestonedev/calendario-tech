class DuplicateEventException(Exception):
    def __init__(
        self,
        message="Event already exists with the same name, organization, and start date.",
    ):
        self.message = message
        super().__init__(self.message)


class EventNotFoundException(Exception):
    def __init__(self, message="Event not found."):
        self.message = message
        super().__init__(self.message)
