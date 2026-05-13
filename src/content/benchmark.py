wood_cf = 2000 / 40
stone_cf = 2000 / 160

struct = [
    ("Hovel / lean-to", 100, "wood", "Squatter shelter, scrap materials"),
    ("Peasant hut", 350, "wood", "12x12 ft, wattle-and-daub, thatch roof"),
    ("Cottage", 600, "wood", "16x20 ft, 2 rooms, timber frame"),
    ("Large house", 1500, "wood", "24x30 ft, 2 stories, burgher"),
    ("Blacksmith forge", 400, "mixed", "Workshop + stone foundation"),
    ("Village inn", 2000, "mixed", "30x40 ft, 2 stories, stone cellar"),
    ("Warehouse", 4000, "wood", "40x60 ft, 20 ft eaves, bulk"),
    ("Wood palisade, 200ft", 1600, "wood", "Around hamlet, 12 ft logs"),
    ("Town wall, 200ft", 16000, "stone", "20 ft tall, 4 ft thick"),
    ("Watchtower, wood", 800, "wood", "20 ft base, 30 ft tall"),
    ("Watchtower, stone", 2500, "stone", "15 ft base, 40 ft tall"),
    ("Small stone keep", 8000, "stone", "60x60 ft base, 50 ft tall"),
    ("Fishing boat", 150, "wood", "25 ft, clinker, crew 2-3"),
    ("Coastal trader 50t", 300, "wood", "Cog, crew 8-12, coastal"),
    ("Ocean cog 200t", 750, "wood", "Cross-Island, crew 20-30"),
    ("Hydrean war galley", 1500, "wood", "Armored, oars + sail"),
    ("Wooden bridge", 800, "wood", "60 ft span, timber trestle"),
    ("Stone bridge", 4000, "stone", "60 ft span, 2 arches"),
    ("Village well", 250, "stone", "30 ft deep, stone-lined"),
    ("Paved road, 1 mi", 63360, "stone", "12 ft wide, 1 ft base"),
    ("Unpaved road, 1 mi", 24000, "soil", "Graded, ditched"),
]

print(f"{'Structure':<24} {'SHP':>5} {'Cost':>10} {'u-days':>7} {'s-days':>5}  Notes")
print("="*75)
for name, cf, mat, notes in struct:
    if mat == "wood":
        shp = round(cf / 50)
        cost = shp * 100
    elif mat == "stone":
        shp = round(cf / 12.5)
        cost = shp * 200
    elif mat == "mixed":
        sw = round(cf * 0.75 / 50)
        ss = round(cf * 0.25 / 12.5)
        shp = sw + ss
        cost = sw * 100 + ss * 200
    elif mat == "soil":
        shp = round(cf / 25)
        cost = shp * 15
    ud = round(cost * 0.85)
    sd = round(cost * 0.15 / 50)
    print(f"{name:<24} {shp:>5} ${cost:>7,} {ud:>6,}u {sd:>3}s  {notes[:38]}")
