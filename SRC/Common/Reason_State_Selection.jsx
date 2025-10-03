import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/MaterialIcons";
import LANGUAGE_DATA from "../Constants/language";

const StateCityModal = ({ visible, onClose, region_City, setLocationArray }) => {
  const STATES_CITIES = region_City;
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [selectedAllState, setSelectedAllState] = useState({})
  const [cityPagination, setCityPagination] = useState({}); // Track how many cities are shown per state

  useEffect(() => {
    if (visible) {
      setSearch('');
      const initialPagination = {};
      Object.keys(STATES_CITIES).forEach((state) => {
        initialPagination[state] = 10;
      });
      setCityPagination(initialPagination);
    }
  }, [visible]);

  const toggleState = (state) => {
    const allSelected = STATES_CITIES[state].every((city) => selectedData[city]);
    const newSelection = { ...selectedData };
    const newState = { ...selectedAllState };  
    STATES_CITIES[state].forEach((city) => {
      newSelection[city] = !allSelected;
    });
    newState[`${state} All City`] = !allSelected
    setSelectedData(newSelection);
    setSelectedAllState(newState)
    setLocationArray(newState);
  };

  const toggleCity = (city) => {
    const updated = {
      ...selectedData,
      [city]: !selectedData[city],
    };
    setSelectedData(updated);
    setLocationArray(updated);
  };

  const loadMoreCities = (state) => {
    setCityPagination((prev) => ({
      ...prev,
      [state]: prev[state] + 10,
    }));
  };

  const normalizedSearch = search.toLowerCase().replace(/\s/g, '');

  const filteredStates = Object.keys(STATES_CITIES).filter((state) => {
    const normalizedState = state.toLowerCase().replace(/\s/g, '');
    const matchInState = normalizedState.includes(normalizedSearch);
      console.log("STATES_CITIES",STATES_CITIES)
    const matchInCities = STATES_CITIES[state].some((city) => {
      const normalizedCity = city.toLowerCase().replace(/\s/g, '');
      return normalizedCity.includes(normalizedSearch);
    });

    return matchInState || matchInCities;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {LANGUAGE_DATA.Select_Regions_Cities}
          </Text>

          <TextInput
            placeholder={LANGUAGE_DATA.Search_Regions_or_city}
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />

          <FlatList
            data={filteredStates}
            keyExtractor={(state) => state}
            renderItem={({ item: state }) => {
              const cities = STATES_CITIES[state] || [];
              const visibleCount = cityPagination[state] || 10;

        const sortedCities = [...cities].sort((a, b) => {
  const extractName = (city) =>
    city.split(" - ")[1]?.toLowerCase().replace(/\s/g, "") || "";

  const cityNameA = extractName(a);
  const cityNameB = extractName(b);

  const score = (name) => {
    if (name === normalizedSearch) return 2;
    if (name.startsWith(normalizedSearch.slice(0, 3))) return 1;
    return 0;
  };

  return score(cityNameB) - score(cityNameA);
});

              const visibleCities = sortedCities.slice(0, visibleCount);
              const selectedCities = cities.filter((city) => selectedData[city]);
              const isAllSelected = selectedCities.length === cities.length;
              const isSomeSelected =
                selectedCities.length > 0 && selectedCities.length < cities.length;

              return (
                <View key={state}>
                  {/* State */}
                  <TouchableOpacity
                    onPress={() => toggleState(state)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                    }}
                  >
                    <CheckBox
                      isChecked={isAllSelected}
                      onClick={() => toggleState(state)}
                      checkBoxColor={isSomeSelected ? "gray" : "black"}
                    />
                    <Text
                      style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold" }}
                    >
                      {state}
                    </Text>
                  </TouchableOpacity>

                  {/* City List */}
                  {visibleCities.map((city) => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => toggleCity(city)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 30,
                        paddingVertical: 5,
                      }}
                    >
                      <CheckBox
                        isChecked={!!selectedData[city]}
                        onClick={() => toggleCity(city)}
                        checkBoxColor="black"
                      />
                      <Text style={{ marginLeft: 10, fontSize: 14 }}>{city}</Text>
                    </TouchableOpacity>
                  ))}

                  {visibleCount < cities.length && (
                    <TouchableOpacity
                      onPress={() => loadMoreCities(state)}
                      style={{
                        paddingLeft: 40,
                        paddingVertical: 5,
                      }}
                    >
                      <Text style={{ color: "#007BFF", fontSize: 14 }}>Load more</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />

          {/* Close */}
          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 10, alignSelf: "flex-end" }}
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default StateCityModal;