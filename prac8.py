#  Дан список некоторых целых чисел, найдите значение 20 в нем и, если оно
# присутствует, замените его на 200. Обновите список только при первом вхождении
# числа 20.
#  Необходимо удалить пустые строки из списка строк.
#  Дан список чисел. Превратите его в список квадратов этих чисел.
#  Дан список чисел, необходимо удалить все вхождения числа 20 из него.

def change_first_20 (list):
    list[list.index(20)] = 200
    return list


def str_not_empty(string):
    return len(string) > 0
def remove_empty (my_list):
    return list(filter(str_not_empty, my_list))


def make_sqr(my_list):
    return [num * num for num in my_list]


def delete_20s(my_list):
    return [num for num in my_list if num != 20]


def main():
    my_list = [23, 12, 20, 25, 20, 16]
    print("change_first_20")
    print("from:", my_list)
    print("to  :", change_first_20(my_list))
    print()

    my_list = ["abra", "kadabra", "", "gogol", "", "mogol"]
    print("remove_empty")
    print("from:", my_list)
    print("to  :", remove_empty(my_list))
    print()

    my_list = [3, 1, 16, 2, 8, 10, 0, -2]
    print("remove_empty")
    print("from:", my_list)
    print("to  :", make_sqr(my_list))
    print()

    my_list = [23, 12, 20, 25, 20, 16]
    print("delete_20s")
    print("from:", my_list)
    print("to  :", delete_20s(my_list))
    print()

main()