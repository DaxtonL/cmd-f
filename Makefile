# Compiler and flags
CXX = clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic

# Target executable
TARGET = main

# Debug toggle (0 = normal, 1 = debug)
DEBUG ?= 0

ifeq ($(DEBUG),1)
MAIN = debug.cpp
else
MAIN = main.cpp
endif

# Source files
SRC = $(MAIN) bomb.cpp player.cpp solution.cpp wire.cpp

# Object directory
OBJDIR = build

# Object files
OBJ = $(addprefix $(OBJDIR)/, $(SRC:.cpp=.o))

# Default target
all: $(OBJDIR) $(TARGET)

# Create build directory
$(OBJDIR):
	mkdir -p $(OBJDIR)

# Link executable
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) $(OBJ) -o $(TARGET)

# Compile source files
$(OBJDIR)/%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean
clean:
	rm -rf $(OBJDIR) $(TARGET)