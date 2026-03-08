# Compiler and flags
CXX = clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic

# Target executable
TARGET = main

# Source files
SRC = main.cpp bomb.cpp player.cpp solution.cpp wire.cpp

# Object directory
OBJDIR = build
# Object files (inside OBJDIR)
OBJ = $(addprefix $(OBJDIR)/, $(SRC:.cpp=.o))

# Default target
all: $(OBJDIR) $(TARGET)

# Create object directory if it doesn't exist
$(OBJDIR):
	mkdir -p $(OBJDIR)

# Link object files into the executable
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) $(OBJ) -o $(TARGET)

# Compile .cpp files into .o files inside OBJDIR
$(OBJDIR)/%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -rf $(OBJDIR) $(TARGET)