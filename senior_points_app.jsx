import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, PlusCircle, RotateCcw, Ticket, Store } from "lucide-react";

const REWARD_THRESHOLD = 10;
const STORAGE_KEY = "senior_points_app_data_v1";

export default function SeniorPointsApp() {
  const [points, setPoints] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [message, setMessage] = useState("ご来店ありがとうございます");
  const [lastVisitDate, setLastVisitDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPoints(data.points || 0);
        setTickets(data.tickets || 0);
        setLastVisitDate(data.lastVisitDate || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ points, tickets, lastVisitDate })
    );
  }, [points, tickets, lastVisitDate]);

  const progressText = useMemo(() => {
    const remain = REWARD_THRESHOLD - points;
    if (remain <= 0) return "無料券に交換できます";
    return `あと ${remain} ポイントで無料券です`;
  }, [points]);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const addVisitPoint = () => {
    const next = points + 1;
    setPoints(next);
    setLastVisitDate(today);

    if (next >= REWARD_THRESHOLD) {
      setPoints(0);
      setTickets((prev) => prev + 1);
      setMessage("無料券を1枚プレゼントしました");
    } else {
      setMessage("1ポイント追加しました");
    }
  };

  const useTicket = () => {
    if (tickets <= 0) {
      setMessage("無料券がありません");
      return;
    }
    setTickets((prev) => prev - 1);
    setMessage("無料券を使いました");
  };

  const resetAll = () => {
    setPoints(0);
    setTickets(0);
    setLastVisitDate("");
    setMessage("リセットしました");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <Store className="h-5 w-5" />
            <span className="text-lg font-medium">かんたん来店ポイント</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ポイントカード</h1>
          <p className="text-xl text-slate-600">ボタンを押すだけでポイントがたまります</p>
        </div>

        <Card className="rounded-3xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center">現在のポイント</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-7xl md:text-8xl font-bold">{points}</div>
            <div className="text-2xl text-slate-600">{progressText}</div>
            <Button
              onClick={addVisitPoint}
              className="w-full min-h-24 text-3xl rounded-3xl"
            >
              <PlusCircle className="mr-3 h-8 w-8" />
              来店で1ポイント
            </Button>
            <div className="text-xl text-slate-500">最終来店: {lastVisitDate || "まだありません"}</div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2 justify-center">
                <Ticket className="h-8 w-8" />
                無料券
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="text-6xl font-bold">{tickets}</div>
              <div className="text-xl text-slate-600">使える無料券の枚数</div>
              <Button
                onClick={useTicket}
                variant="secondary"
                className="w-full min-h-20 text-2xl rounded-3xl"
              >
                <Gift className="mr-3 h-7 w-7" />
                無料券を使う
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-center">お知らせ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="min-h-28 flex items-center justify-center rounded-3xl bg-slate-100 px-4 text-2xl font-medium">
                {message}
              </div>
              <Button
                onClick={resetAll}
                variant="outline"
                className="w-full min-h-20 text-2xl rounded-3xl"
              >
                <RotateCcw className="mr-3 h-7 w-7" />
                リセット
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-dashed">
          <CardContent className="pt-6 text-xl md:text-2xl leading-relaxed text-slate-700">
            <p>・来店時に「来店で1ポイント」を押します</p>
            <p>・10ポイントたまると自動で無料券1枚になります</p>
            <p>・無料券は「無料券を使う」で消化できます</p>
            <p>・データはこの端末内に保存されます</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
