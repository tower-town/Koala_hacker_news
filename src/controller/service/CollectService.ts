/*
 * ====================================================
 *   Copyright (C) 2023 river All rights reserved.
 *
 *   Author        : tower_town
 *   Email         : tower_town@outlook.com
 *   File Name     : Collect.ts
 *   Last Modified : 2023-08-25 19:54:17
 *   Describe      :
 *
 * ====================================================
 */

import _ from "underscore";
import { BvidData } from "../../common/type";
import { Utils, fetchJson } from "../../common/utils";
import { HackerNewsList } from "../../model/HackerNewsList";
import { HackerNewsBeamer } from "../../model/beamer/HackerNewsBeamer";
import { ServiceBaseDAO } from "../base/ServiceBase";

export class CollectService extends ServiceBaseDAO {
	initUrl(): URL {
		const apiData = this.data.collectURLParams;
		const url = new URL(apiData.url);
		const params = new URLSearchParams(apiData.params);

		return Utils.parseUrl(url, params)
	}

	filterData(hn: HackerNewsBeamer, hnlist: HackerNewsBeamer[]): boolean {
		hnlist.forEach((v, _) => {
			if (v.Bvid !== hn.Bvid) {
				return true;
			}
		})
		return false;
	}

	async updateData<U, V>(u: U, v: V): Promise<void> {
		try {
			const hnlist = await u as HackerNewsBeamer[];
			const hn = v as HackerNewsBeamer;
			this.filterData(hn, hnlist) && new HackerNewsList().updateList(hnlist, hn);
		} catch (error) {
			throw new Error(`${error}`)

		}
	}

	#getDataSet(data: Record<string, unknown>): BvidData {
		return {
			title: data.title,
			aid: data.aid,
			bvid: data.bvid,
			pubdate: data.pubdate,
		} as BvidData;
	}

	async init(): Promise<void> {
		const hnlist = await this.loadData();
		_.chain([this.initUrl()])
			.map((url) => fetchJson(url))
			.map((promise) => promise.then((data) => {
				const dataset: Record<string, unknown>[] = data.data.archives;
				return _.map(dataset, (data) => this.#getDataSet(data));
			}))
			.map((promise) =>
				promise.then((data) =>
					data.sort((a, b) => b.pubdate - a.pubdate)
						.map((data) => async () => {
							await this.updateData(
								hnlist,
								new HackerNewsBeamer(data.bvid,
									data.title,
									data.aid,
									data.pubdate)
							)
						})
				)
			)
			.value();

	}
}