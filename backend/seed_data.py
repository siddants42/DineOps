import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

EMAIL = input("Admin email: ")
PASSWORD = input("Admin password: ")

categories = [
    ("Beverages", "Cold and hot beverages"),
    ("Burgers", "Freshly prepared burgers"),
    ("Pizza", "Freshly baked pizzas"),
    ("Pasta", "Italian pasta dishes"),
    ("Starters", "Appetizers and snacks"),
    ("Main Course", "Main course meals"),
    ("Desserts", "Sweet dishes and desserts"),
    ("Salads", "Fresh salads"),
    ("Sandwiches", "Fresh sandwiches"),
    ("Breakfast", "Breakfast items"),
]

products = [
    ("Cold Coffee", "BEV-001", 120, "Beverages", "Chilled creamy cold coffee"),
    ("Fresh Lime Soda", "BEV-002", 90, "Beverages", "Refreshing lime soda"),
    ("Mango Shake", "BEV-003", 140, "Beverages", "Fresh mango milkshake"),

    ("Classic Chicken Burger", "BUR-001", 220, "Burgers", "Juicy chicken burger"),
    ("Veg Supreme Burger", "BUR-002", 180, "Burgers", "Loaded vegetarian burger"),

    ("Margherita Pizza", "PIZ-001", 250, "Pizza", "Classic tomato and mozzarella pizza"),
    ("Farmhouse Pizza", "PIZ-002", 320, "Pizza", "Loaded vegetable farmhouse pizza"),

    ("Penne Arrabbiata", "PAS-001", 240, "Pasta", "Penne pasta in spicy tomato sauce"),
    ("Creamy Alfredo Pasta", "PAS-002", 280, "Pasta", "Creamy white sauce pasta"),

    ("French Fries", "STR-001", 120, "Starters", "Crispy golden french fries"),
    ("Paneer Tikka", "STR-002", 240, "Starters", "Grilled Indian paneer tikka"),

    ("Butter Chicken", "MAIN-001", 320, "Main Course", "Creamy butter chicken"),
    ("Paneer Butter Masala", "MAIN-002", 280, "Main Course", "Paneer cooked in rich tomato gravy"),

    ("Chocolate Brownie", "DES-001", 150, "Desserts", "Warm chocolate brownie"),
    ("Gulab Jamun", "DES-002", 100, "Desserts", "Soft gulab jamun"),

    ("Caesar Salad", "SAL-001", 190, "Salads", "Fresh Caesar salad"),
    ("Greek Salad", "SAL-002", 180, "Salads", "Fresh Greek vegetable salad"),

    ("Grilled Chicken Sandwich", "SAN-001", 210, "Sandwiches", "Grilled chicken sandwich"),
    ("Veg Club Sandwich", "SAN-002", 170, "Sandwiches", "Triple-layer vegetarian sandwich"),

    ("Masala Omelette", "BRK-001", 130, "Breakfast", "Indian-style masala omelette"),
]


def login():
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": EMAIL,
            "password": PASSWORD,
        },
    )

    if response.status_code != 200:
        print("Login failed:", response.text)
        raise SystemExit(1)

    token = response.json()["access_token"]

    print("Login successful.")

    return {
        "Authorization": f"Bearer {token}"
    }


def get_categories(headers):
    response = requests.get(
        f"{BASE_URL}/categories/",
        headers=headers,
    )

    response.raise_for_status()

    return response.json()


def create_category(headers, name, description):
    response = requests.post(
        f"{BASE_URL}/categories/",
        headers=headers,
        json={
            "name": name,
            "description": description,
        },
    )

    if response.status_code in (200, 201):
        return response.json()

    if response.status_code in (400, 409):
        return None

    print("Category error:", response.text)
    response.raise_for_status()


def create_product(
    headers,
    name,
    sku,
    price,
    category_id,
    description,
):
    response = requests.post(
        f"{BASE_URL}/products/",
        headers=headers,
        json={
            "name": name,
            "sku": sku,
            "description": description,
            "price": price,
            "category_id": category_id,
        },
    )

    if response.status_code in (200, 201):
        return response.json()

    if response.status_code in (400, 409):
        print(f"Skipping existing product: {name}")
        return None

    print("Product error:", response.text)
    response.raise_for_status()


def main():
    headers = login()

    print("\nCreating categories...")

    existing_categories = {
        category["name"].lower(): category["id"]
        for category in get_categories(headers)
    }

    category_ids = {}

    for name, description in categories:
        key = name.lower()

        if key in existing_categories:
            category_ids[key] = existing_categories[key]
            print(f"Already exists: {name}")
            continue

        category = create_category(
            headers,
            name,
            description,
        )

        if category:
            category_ids[key] = category["id"]
            print(f"Created category: {name}")

    print("\nCreating products...")

    for name, sku, price, category, description in products:
        category_id = category_ids.get(
            category.lower()
        )

        if not category_id:
            print(f"Category missing: {category}")
            continue

        create_product(
            headers,
            name,
            sku,
            price,
            category_id,
            description,
        )

        print(f"Created/checked: {name}")

    print("\nSeed completed successfully.")


if __name__ == "__main__":
    main()