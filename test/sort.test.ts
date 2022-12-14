import { Sort } from "../src/componet/sort";
import { Utils } from "../src/componet/utils";
import { JsonData } from "../src/types/type";

test("test quicksort", () => {
	let rand_list = [1, 6, 3, 9, 8, 67, 25, 4, 10, 7, 45, 89];

	const sort = new Sort();
	sort.quicksort(rand_list, 0, rand_list.length - 1);

	let expect_list = [1, 3, 4, 6, 7, 8, 9, 10, 25, 45, 67, 89];
	expect(rand_list).toEqual(expect_list);
});

test("test sort json data", () => {
	let json_data: JsonData = {
		two: {
			aid: 2,
			bvid: "two",
			title: "this is two",
			pubdate: 2,
		},
		one: {
			aid: 1,
			bvid: "one",
			title: "this is one",
			pubdate: 1,
		},
		three: {
			aid: 3,
			bvid: "three",
			title: "this is three",
			pubdate: 3,
		},
	};

	let expect_json: JsonData = {
		three: {
			aid: 3,
			bvid: "three",
			title: "this is three",
			pubdate: 3,
		},
		two: {
			aid: 2,
			bvid: "two",
			title: "this is two",
			pubdate: 2,
		},
		one: {
			aid: 1,
			bvid: "one",
			title: "this is one",
			pubdate: 1,
		},
	};

	const utils = new Utils();

	let recieve_json = utils.sortJson(json_data, "pubdate");

	expect(recieve_json).toStrictEqual(expect_json);

	let recieve_json_str = JSON.stringify(recieve_json);
	let expect_json_str = JSON.stringify(expect_json);

	expect(recieve_json_str).toBe(expect_json_str);
});
