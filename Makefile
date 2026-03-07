# Compiler and flags
CXX = clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic

# Target executable
TARGET = main

# Source files
SRC = main.cpp bomb.cpp

# Object files
OBJ = $(SRC:.cpp=.o)

# Default target
all: $(TARGET)

# Link object files into the executable
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) $(OBJ) -o $(TARGET)

# Compile .cpp files into .o files
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -f $(OBJ) $(TARGET)