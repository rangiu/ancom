/**
 * Bộ 40 bài tập thể dục không cần dụng cụ (body weight), tuyển chọn từ
 * dataset công khai: https://github.com/hasaneyldrm/exercises-dataset
 * (dữ liệu văn bản dùng license MIT). Ảnh/GIF minh hoạ động tác thuộc bản
 * quyền Gym Visual (gymvisual.com) — sử dụng theo sự cho phép trực tiếp từ
 * chủ dataset dành cho dự án này.
 *
 * Tên + hướng dẫn tiếng Việt do đội ngũ an_com biên soạn lại (không dịch
 * nguyên văn) cho ngắn gọn, dễ hiểu, phù hợp gợi ý tập nhanh mỗi ngày.
 */

export interface Exercise {
  id: string;
  name: { vi: string; en: string };
  bodyPart: { vi: string; en: string };
  target: { vi: string; en: string };
  steps: { vi: string[]; en: string[] };
  image: string;
  gif: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: '0662',
    name: { vi: 'Chống đẩy', en: 'Push-up' },
    bodyPart: { vi: 'Ngực', en: 'Chest' },
    target: { vi: 'Cơ ngực', en: 'Pectorals' },
    steps: {
      vi: [
        'Vào tư thế plank cao, hai tay rộng hơn vai một chút, hai chân khép.',
        'Siết cơ bụng, hạ người xuống bằng cách gập khuỷu tay, giữ thân người thẳng.',
        'Khi ngực gần chạm sàn thì dừng lại, sau đó đẩy người lên vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Start in a high plank position with your hands slightly wider than shoulder-width apart and your feet together.',
        'Engage your core and lower your body towards the ground by bending your elbows, keeping your body in a straight line.',
        'Pause for a moment when your chest is just above the ground, then push yourself back up to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0662.jpg',
    gif: '/exercises/gifs/0662.gif',
  },
  {
    id: '0659',
    name: { vi: 'Chống đẩy tường', en: 'Wall push-up' },
    bodyPart: { vi: 'Ngực', en: 'Chest' },
    target: { vi: 'Cơ ngực', en: 'Pectorals' },
    steps: {
      vi: [
        'Đứng đối diện tường, cách khoảng một sải tay.',
        'Đặt hai tay lên tường ngang vai, rộng hơn vai một chút.',
        'Lùi chân ra sau vài bước, giữ người thẳng.',
        'Gập khuỷu tay, hạ ngực về phía tường rồi đẩy người trở lại.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        "Stand facing a wall, about arm's length away.",
        'Place your hands on the wall at shoulder height, slightly wider than shoulder-width apart.',
        'Step back a few feet, keeping your body straight.',
        'Bend your elbows and lower your chest towards the wall, then push back up.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0659.jpg',
    gif: '/exercises/gifs/0659.gif',
  },
  {
    id: '0493',
    name: { vi: 'Chống đẩy tay kê cao', en: 'Incline push-up' },
    bodyPart: { vi: 'Ngực', en: 'Chest' },
    target: { vi: 'Cơ ngực', en: 'Pectorals' },
    steps: {
      vi: [
        'Đặt hai tay lên bề mặt cao (ghế, bậc thềm), rộng hơn vai.',
        'Duỗi thẳng chân ra sau, tạo đường thẳng từ đầu đến gót chân.',
        'Gập khuỷu tay hạ ngực xuống gần bề mặt kê.',
        'Đẩy người lên vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Place your hands on an elevated surface, slightly wider than shoulder-width apart.',
        'Extend your legs behind you, creating a straight line from head to heels.',
        'Lower your chest towards the elevated surface by bending your elbows.',
        'Push yourself back up to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0493.jpg',
    gif: '/exercises/gifs/0493.gif',
  },
  {
    id: '0279',
    name: { vi: 'Chống đẩy chân kê cao', en: 'Decline push-up' },
    bodyPart: { vi: 'Ngực', en: 'Chest' },
    target: { vi: 'Cơ ngực', en: 'Pectorals' },
    steps: {
      vi: [
        'Đặt hai tay xuống sàn rộng hơn vai, hai chân kê lên bề mặt cao.',
        'Giữ thân người thẳng từ đầu đến chân, siết cơ bụng.',
        'Gập khuỷu tay hạ ngực xuống gần sàn.',
        'Đẩy tay để trở về vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Place your hands on the ground slightly wider than shoulder-width apart, with feet elevated on a stable surface.',
        'Keep your body in a straight line from head to toe.',
        'Lower your chest towards the ground by bending your elbows.',
        'Push through your palms to return to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0279.jpg',
    gif: '/exercises/gifs/0279.gif',
  },
  {
    id: '0283',
    name: { vi: 'Chống đẩy kim cương', en: 'Diamond push-up' },
    bodyPart: { vi: 'Tay trên', en: 'Upper arms' },
    target: { vi: 'Tay sau (triceps)', en: 'Triceps' },
    steps: {
      vi: [
        'Vào tư thế plank cao, hai tay chụm gần nhau tạo hình kim cương.',
        'Giữ thân người thẳng, siết bụng và mông.',
        'Hạ ngực xuống gần hai tay, khuỷu tay sát người.',
        'Đẩy người lên vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Start in a high plank position with your hands close together, forming a diamond shape.',
        'Keep your body in a straight line, engaging your core and glutes.',
        'Lower your chest towards your hands, keeping elbows close to your body.',
        'Push yourself back up to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0283.jpg',
    gif: '/exercises/gifs/0283.gif',
  },
  {
    id: '0815',
    name: { vi: 'Gập tay sau trên ghế', en: 'Triceps dips (floor)' },
    bodyPart: { vi: 'Tay trên', en: 'Upper arms' },
    target: { vi: 'Tay sau (triceps)', en: 'Triceps' },
    steps: {
      vi: [
        'Ngồi trên mép ghế, hai tay đặt cạnh hông, ngón tay hướng về trước.',
        'Trượt mông ra khỏi ghế, hai chân duỗi thẳng phía trước.',
        'Từ từ gập khuỷu tay hạ người xuống đến khi khuỷu tay tạo góc 90 độ.',
        'Đẩy tay để nâng người trở lại vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Sit on the edge of a chair with your hands next to your hips.',
        'Slide your hips off the front of the chair, legs extended in front of you.',
        'Slowly bend your elbows to lower your body until elbows reach about 90 degrees.',
        'Press down to straighten your elbows and return to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0815.jpg',
    gif: '/exercises/gifs/0815.gif',
  },
  {
    id: '1467',
    name: { vi: 'Chống đẩy cẳng tay', en: 'Push-up on forearms' },
    bodyPart: { vi: 'Tay trên', en: 'Upper arms' },
    target: { vi: 'Tay sau (triceps)', en: 'Triceps' },
    steps: {
      vi: [
        'Vào tư thế plank với hai cẳng tay chạm sàn, khuỷu tay thẳng dưới vai.',
        'Siết cơ bụng, giữ thân người thẳng từ đầu đến chân.',
        'Hạ ngực gần sàn, khuỷu tay sát người.',
        'Đẩy người trở lại vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Start in a plank position with your forearms on the ground, elbows below your shoulders.',
        'Engage your core, keeping your body in a straight line.',
        'Lower your chest towards the ground, elbows close to your body.',
        'Push yourself back up to the starting position.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1467.jpg',
    gif: '/exercises/gifs/1467.gif',
  },
  {
    id: '1362',
    name: { vi: 'Tư thế nhân sư', en: 'Sphinx' },
    bodyPart: { vi: 'Lưng', en: 'Back' },
    target: { vi: 'Cột sống', en: 'Spine' },
    steps: {
      vi: [
        'Nằm sấp, hai cẳng tay đặt phẳng trên sàn, khuỷu tay thẳng dưới vai.',
        'Siết cơ bụng, nâng ngực khỏi sàn, cẳng tay và mũi chân vẫn chạm sàn.',
        'Giữ tư thế vài giây, cổ ở vị trí trung lập.',
        'Từ từ hạ ngực xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie face down with your forearms flat on the floor, elbows under your shoulders.',
        'Engage your core and lift your chest off the ground.',
        'Hold this position for a few seconds, keeping your neck neutral.',
        'Slowly lower your chest back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1362.jpg',
    gif: '/exercises/gifs/1362.gif',
  },
  {
    id: '1366',
    name: { vi: 'Tư thế chó ngẩng đầu', en: 'Upward facing dog' },
    bodyPart: { vi: 'Lưng', en: 'Back' },
    target: { vi: 'Cột sống', en: 'Spine' },
    steps: {
      vi: [
        'Nằm sấp, hai chân duỗi thẳng ra sau.',
        'Đặt hai tay cạnh sườn dưới, ngón tay hướng về trước.',
        'Ấn tay xuống sàn, duỗi thẳng tay để nâng thân trên và đùi khỏi sàn.',
        'Đẩy vai ra sau và xuống, mở ngực, hướng mắt lên trần.',
        'Giữ vài nhịp thở rồi hạ người xuống vị trí ban đầu.',
      ],
      en: [
        'Lie face down with your legs extended behind you.',
        'Place your hands next to your lower ribs.',
        'Press into the floor and straighten your arms, lifting your torso and thighs.',
        'Roll your shoulders back and down, opening your chest.',
        'Hold for a few breaths, then lower back down.',
      ],
    },
    image: '/exercises/images/1366.jpg',
    gif: '/exercises/gifs/1366.gif',
  },
  {
    id: '1364',
    name: { vi: 'Nghiêng khung chậu', en: 'Standing pelvic tilt' },
    bodyPart: { vi: 'Lưng', en: 'Back' },
    target: { vi: 'Cột sống', en: 'Spine' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai, đầu gối hơi chùng.',
        'Đặt tay lên hông hoặc thả lỏng hai bên.',
        'Siết cơ bụng, nghiêng khung chậu về trước, đẩy lưng dưới ra sau.',
        'Giữ vài giây rồi thả lỏng về vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart, knees slightly bent.',
        'Place your hands on your hips or let them hang by your sides.',
        'Engage your core and tilt your pelvis forward.',
        'Hold for a few seconds, then release.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1364.jpg',
    gif: '/exercises/gifs/1364.gif',
  },
  {
    id: '3231',
    name: { vi: 'Cúi chạm ngón chân', en: 'Two toe touch' },
    bodyPart: { vi: 'Lưng', en: 'Back' },
    target: { vi: 'Cột sống', en: 'Spine' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai, hai tay dang ngang.',
        'Gập người về trước từ hông, giữ lưng thẳng, gối hơi chùng.',
        'Vươn hai tay chạm xuống ngón chân.',
        'Dừng lại một chút rồi từ từ đứng thẳng dậy.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart, arms extended out to the sides.',
        'Bend forward at the waist, keeping your back straight.',
        'Reach down towards your toes with both hands.',
        'Pause for a moment, then slowly return to standing.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/3231.jpg',
    gif: '/exercises/gifs/3231.gif',
  },
  {
    id: '0001',
    name: { vi: 'Gập bụng 3/4', en: '3/4 sit-up' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, hai bàn chân chạm sàn.',
        'Đặt hai tay sau đầu, khuỷu tay mở ra hai bên.',
        'Siết cơ bụng, từ từ nâng thân trên khỏi sàn đến khi thân tạo góc 45 độ.',
        'Dừng lại một chút rồi hạ người xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Place your hands behind your head, elbows pointing outwards.',
        'Engage your abs and slowly lift your upper body to a 45-degree angle.',
        'Pause, then slowly lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0001.jpg',
    gif: '/exercises/gifs/0001.gif',
  },
  {
    id: '0274',
    name: { vi: 'Gập bụng cơ bản', en: 'Crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Đặt tay sau đầu, khuỷu tay mở ra hai bên.',
        'Siết bụng, nâng vai khỏi sàn, cuộn người về phía gối.',
        'Dừng lại một chút rồi hạ vai xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Place your hands behind your head.',
        'Engage your abs and lift your shoulders off the ground, curling forward.',
        'Pause, then slowly lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0274.jpg',
    gif: '/exercises/gifs/0274.gif',
  },
  {
    id: '0872',
    name: { vi: 'Gập bụng ngược', en: 'Reverse crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, hai tay duỗi dọc thân người.',
        'Gập gối, nâng chân khỏi sàn sao cho đùi vuông góc với sàn.',
        'Siết bụng, cuộn hông khỏi sàn, đưa gối về phía ngực.',
        'Dừng lại một chút rồi hạ hông xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with arms extended along your sides.',
        'Bend your knees, lifting your feet with thighs perpendicular to the floor.',
        'Contract your abs and curl your hips off the floor.',
        'Pause, then slowly lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0872.jpg',
    gif: '/exercises/gifs/0872.gif',
  },
  {
    id: '0276',
    name: { vi: 'Bọ chết (dead bug)', en: 'Dead bug' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, hai tay duỗi thẳng lên trần, gối gập tạo góc 90 độ.',
        'Siết bụng, ép lưng dưới xuống sàn.',
        'Từ từ hạ tay phải và chân trái xuống gần sàn, giữ thẳng.',
        'Trở về vị trí ban đầu rồi đổi bên.',
        'Luân phiên hai bên theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back, arms extended towards the ceiling.',
        'Bend your knees to a 90-degree angle at hips and knees.',
        'Slowly lower your right arm and left leg towards the ground.',
        'Return to the starting position, then repeat on the other side.',
        'Continue alternating sides for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0276.jpg',
    gif: '/exercises/gifs/0276.gif',
  },
  {
    id: '0687',
    name: { vi: 'Xoay người Nga (Russian twist)', en: 'Russian twist' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ liên sườn', en: 'Obliques' },
    steps: {
      vi: [
        'Ngồi trên sàn, gối gập, bàn chân chạm sàn.',
        'Ngả người ra sau một chút, giữ lưng thẳng, siết bụng.',
        'Chắp hai tay trước ngực, nhấc chân khỏi sàn nếu có thể.',
        'Xoay thân sang phải rồi sang trái, luân phiên liên tục.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Sit on the ground with knees bent, feet flat on the floor.',
        'Lean back slightly, keeping your back straight.',
        'Hold your hands together in front of your chest.',
        'Twist your torso to the right, then to the left.',
        'Continue alternating sides for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0687.jpg',
    gif: '/exercises/gifs/0687.gif',
  },
  {
    id: '0464',
    name: { vi: 'Plank xoay người', en: 'Front plank with twist' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ liên sườn', en: 'Obliques' },
    steps: {
      vi: [
        'Vào tư thế plank cao, hai tay thẳng dưới vai, thân người thẳng.',
        'Siết bụng và mông để giữ ổn định.',
        'Xoay thân sang phải, nâng tay phải hướng lên trần.',
        'Trở về vị trí ban đầu rồi lặp lại bên trái.',
        'Luân phiên hai bên theo số lần mong muốn.',
      ],
      en: [
        'Start in a high plank position, hands under shoulders.',
        'Engage your core and glutes for stability.',
        'Rotate your torso to the right, lifting your right arm up.',
        'Return to start, then repeat on the left.',
        'Continue alternating sides for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0464.jpg',
    gif: '/exercises/gifs/0464.gif',
  },
  {
    id: '0635',
    name: { vi: 'Gập bụng xiên', en: 'Oblique crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ liên sườn', en: 'Obliques' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Đặt tay sau đầu hoặc bắt chéo trước ngực.',
        'Siết bụng, nâng vai khỏi sàn, xoay thân sang một bên.',
        'Dừng lại rồi hạ vai xuống sàn, đổi bên.',
        'Lặp lại luân phiên theo số lần mong muốn.',
      ],
      en: [
        'Lie on your back with knees bent, feet flat on the floor.',
        'Place your hands behind your head.',
        'Engage your abs and lift your shoulder blades, rotating to one side.',
        'Pause, then lower back down and repeat on the other side.',
        'Continue alternating for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0635.jpg',
    gif: '/exercises/gifs/0635.gif',
  },
  {
    id: '0277',
    name: { vi: 'Gập bụng chân kê cao', en: 'Decline crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm trên bề mặt nghiêng (hoặc kê chân cao), gối gập góc 90 độ.',
        'Đặt tay sau đầu hoặc bắt chéo trước ngực.',
        'Siết bụng, nâng thân trên về phía gối.',
        'Dừng lại một chút rồi hạ người xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie on a decline surface with knees bent at 90 degrees.',
        'Place your hands behind your head.',
        'Engage your abs and lift your upper body towards your knees.',
        'Pause, then slowly lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0277.jpg',
    gif: '/exercises/gifs/0277.gif',
  },
  {
    id: '1471',
    name: { vi: 'Sâu đo (inchworm)', en: 'Inchworm' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Đứng thẳng, hai chân rộng bằng hông.',
        'Gập người từ hông, đặt hai tay xuống sàn trước mặt.',
        'Bước tay dần về trước đến khi vào tư thế plank cao.',
        'Bước tay ngược trở lại về phía chân rồi đứng thẳng dậy.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Start standing with feet hip-width apart.',
        'Bend forward at the waist, placing hands on the ground.',
        'Walk your hands forward into a high plank position.',
        'Walk your hands back towards your feet and stand up.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1471.jpg',
    gif: '/exercises/gifs/1471.gif',
  },
  {
    id: '0871',
    name: { vi: 'Gập bụng co gối', en: 'Tuck crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Đặt tay sau đầu, khuỷu tay mở ra hai bên.',
        'Siết bụng, nâng vai khỏi sàn đồng thời kéo gối về phía ngực.',
        'Dừng lại một chút rồi hạ vai và duỗi chân về vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Place your hands behind your head.',
        'Engage your abs, lifting shoulder blades and bringing knees to your chest.',
        'Pause, then lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0871.jpg',
    gif: '/exercises/gifs/0871.gif',
  },
  {
    id: '3640',
    name: { vi: 'Gập bụng chạm gối', en: 'Knee touch crunch' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Đặt tay sau đầu, khuỷu tay mở ra hai bên.',
        'Siết bụng, nâng vai khỏi sàn, đưa tay phải chạm gối trái.',
        'Trở về vị trí ban đầu rồi đổi bên.',
        'Luân phiên hai bên theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Place your hands behind your head.',
        'Engage your abs, lifting shoulders and reaching right hand to left knee.',
        'Return to start, then repeat on the other side.',
        'Continue alternating sides for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/3640.jpg',
    gif: '/exercises/gifs/3640.gif',
  },
  {
    id: '2466',
    name: { vi: 'Leo núi (mountain climber)', en: 'Mountain climber' },
    bodyPart: { vi: 'Vùng bụng', en: 'Waist' },
    target: { vi: 'Cơ bụng', en: 'Abs' },
    steps: {
      vi: [
        'Vào tư thế plank cao, hai tay thẳng dưới vai, thân người thẳng.',
        'Siết bụng, nâng gối phải về phía khuỷu tay trái.',
        'Trở chân phải về vị trí ban đầu, đổi chân trái với khuỷu tay phải.',
        'Luân phiên hai bên với nhịp độ vừa phải, giữ hông ổn định.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Start in a high plank position, hands under shoulders.',
        'Engage your core, bringing your right knee towards your left elbow.',
        'Return, then repeat with the left knee towards the right elbow.',
        'Continue alternating at a controlled pace.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/2466.jpg',
    gif: '/exercises/gifs/2466.gif',
  },
  {
    id: '1160',
    name: { vi: 'Burpee', en: 'Burpee' },
    bodyPart: { vi: 'Tim mạch', en: 'Cardio' },
    target: { vi: 'Tim mạch', en: 'Cardiovascular system' },
    steps: {
      vi: [
        'Đứng thẳng, hai chân rộng bằng vai.',
        'Hạ người xuống tư thế squat, đặt hai tay xuống sàn trước mặt.',
        'Đá chân ra sau vào tư thế chống đẩy, thực hiện một lần chống đẩy.',
        'Nhảy chân về lại tư thế squat rồi bật nhảy lên cao, vươn tay qua đầu.',
        'Tiếp đất nhẹ nhàng rồi lặp lại ngay động tác tiếp theo.',
      ],
      en: [
        'Start standing with feet shoulder-width apart.',
        'Lower into a squat, placing hands on the floor.',
        'Kick your feet back into a push-up position and perform a push-up.',
        'Jump your feet back to squat, then jump up reaching arms overhead.',
        'Land softly and repeat immediately.',
      ],
    },
    image: '/exercises/images/1160.jpg',
    gif: '/exercises/gifs/1160.gif',
  },
  {
    id: '0501',
    name: { vi: 'Burpee kiểu jack', en: 'Jack burpee' },
    bodyPart: { vi: 'Tim mạch', en: 'Cardio' },
    target: { vi: 'Tim mạch', en: 'Cardiovascular system' },
    steps: {
      vi: [
        'Đứng thẳng, hai chân rộng bằng vai.',
        'Hạ người xuống squat, đặt tay xuống sàn.',
        'Đá chân ra sau vào tư thế chống đẩy, chống đẩy một lần.',
        'Nhảy chân về trước vào squat rồi bật nhảy lên cao, vươn tay qua đầu.',
        'Tiếp đất nhẹ nhàng rồi lặp lại ngay.',
      ],
      en: [
        'Start standing with feet shoulder-width apart.',
        'Lower into a squat, placing hands on the ground.',
        'Kick feet back into push-up position, perform a push-up.',
        'Jump feet forward to squat, then jump up reaching arms overhead.',
        'Land softly and repeat immediately.',
      ],
    },
    image: '/exercises/images/0501.jpg',
    gif: '/exercises/gifs/0501.gif',
  },
  {
    id: '3223',
    name: { vi: 'Nhảy ngôi sao', en: 'Star jump' },
    bodyPart: { vi: 'Tim mạch', en: 'Cardio' },
    target: { vi: 'Tim mạch', en: 'Cardiovascular system' },
    steps: {
      vi: [
        'Đứng thẳng, hai chân rộng bằng vai, tay thả lỏng hai bên.',
        'Chùng gối nhẹ rồi bật nhảy lên mạnh.',
        'Khi nhảy, dang rộng chân và tay tạo hình ngôi sao.',
        'Tiếp đất nhẹ nhàng bằng mũi chân, gối hơi chùng.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart, arms at your sides.',
        'Bend your knees slightly and jump up explosively.',
        'Spread your legs and arms out to form a star shape mid-air.',
        'Land softly on the balls of your feet.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/3223.jpg',
    gif: '/exercises/gifs/3223.gif',
  },
  {
    id: '3636',
    name: { vi: 'Nâng cao gối tựa tường', en: 'High knee against wall' },
    bodyPart: { vi: 'Tim mạch', en: 'Cardio' },
    target: { vi: 'Tim mạch', en: 'Cardiovascular system' },
    steps: {
      vi: [
        'Đứng đối diện tường, hai chân rộng bằng hông, tay tựa tường.',
        'Siết bụng, nâng gối phải lên cao ngang ngực.',
        'Nhanh chóng đổi chân, nâng gối trái lên và hạ chân phải xuống.',
        'Luân phiên liên tục như đang chạy tại chỗ, nhịp nhanh.',
        'Thực hiện trong khoảng thời gian hoặc số lần mong muốn.',
      ],
      en: [
        'Stand facing a wall, hands on the wall for support.',
        'Engage your core and lift your right knee towards your chest.',
        'Quickly switch legs, lifting the left knee and lowering the right foot.',
        'Continue alternating in a fast running motion.',
        'Perform for the desired duration or number of repetitions.',
      ],
    },
    image: '/exercises/images/3636.jpg',
    gif: '/exercises/gifs/3636.gif',
  },
  {
    id: '3655',
    name: { vi: 'Lunge bước nâng cao gối', en: 'Walking high knees lunge' },
    bodyPart: { vi: 'Tim mạch', en: 'Cardio' },
    target: { vi: 'Tim mạch', en: 'Cardiovascular system' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng hông.',
        'Nâng gối phải lên cao ngang ngực, đứng thăng bằng trên chân trái.',
        'Bước chân phải về trước, hạ người vào tư thế lunge.',
        'Đẩy chân phải, nâng gối trái rồi bước chân trái về trước vào lunge.',
        'Luân phiên bước về trước với nhịp độ ổn định.',
      ],
      en: [
        'Stand with feet hip-width apart.',
        'Lift your right knee towards your chest, balancing on your left leg.',
        'Step forward with your right foot into a lunge.',
        'Push off, lift your left knee, then step forward into the next lunge.',
        'Continue alternating legs at a steady pace.',
      ],
    },
    image: '/exercises/images/3655.jpg',
    gif: '/exercises/gifs/3655.gif',
  },
  {
    id: '0514',
    name: { vi: 'Squat bật nhảy', en: 'Jump squat' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai.',
        'Hạ người xuống squat, gập gối, đẩy hông ra sau.',
        'Bật nhảy mạnh lên khỏi sàn, duỗi thẳng hông, gối, mắt cá.',
        'Tiếp đất nhẹ nhàng bằng mũi chân rồi vào ngay lần lặp tiếp theo.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart.',
        'Lower into a squat by bending your knees, pushing hips back.',
        'Jump explosively off the ground.',
        'Land softly on the balls of your feet and repeat.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/0514.jpg',
    gif: '/exercises/gifs/0514.gif',
  },
  {
    id: '3769',
    name: { vi: 'Squat chân chéo', en: 'Curtsey squat' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai.',
        'Bước chân phải chéo ra sau và ngang qua thân, sau chân trái.',
        'Gập cả hai gối như đang cúi chào, hạ người xuống.',
        'Đẩy chân trước để trở về vị trí ban đầu.',
        'Lặp lại, đổi bên với chân trái.',
      ],
      en: [
        'Stand with feet shoulder-width apart.',
        'Step your right foot diagonally behind and across your body.',
        'Bend both knees, lowering your body as if curtsying.',
        'Push through your front foot to return to standing.',
        'Repeat on the other side.',
      ],
    },
    image: '/exercises/images/3769.jpg',
    gif: '/exercises/gifs/3769.gif',
  },
  {
    id: '3470',
    name: { vi: 'Lunge bước tới', en: 'Forward lunge' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng hông, tay chống hông.',
        'Bước chân phải về trước một bước dài, hạ người vào tư thế lunge.',
        'Gập gối phải góc khoảng 90 độ.',
        'Đẩy chân phải để trở về vị trí ban đầu.',
        'Lặp lại với chân trái, luân phiên hai bên.',
      ],
      en: [
        'Stand with feet hip-width apart, hands on hips.',
        'Step forward with your right foot into a lunge.',
        'Bend your right knee to about 90 degrees.',
        'Push off to return to the starting position.',
        'Repeat with the left leg, alternating sides.',
      ],
    },
    image: '/exercises/images/3470.jpg',
    gif: '/exercises/gifs/3470.gif',
  },
  {
    id: '1460',
    name: { vi: 'Lunge bước đi', en: 'Walking lunge' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai.',
        'Bước chân phải về trước, hạ người vào tư thế lunge.',
        'Đẩy chân phải, bước chân trái về trước vào tư thế lunge tiếp theo.',
        'Tiếp tục luân phiên bước đi về trước với nhịp ổn định.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart.',
        'Step forward with your right leg into a lunge.',
        'Push off and step forward with your left leg into the next lunge.',
        'Continue alternating legs, walking forward.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1460.jpg',
    gif: '/exercises/gifs/1460.gif',
  },
  {
    id: '2368',
    name: { vi: 'Squat chân trước sau', en: 'Split squat' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Đùi trước', en: 'Quads' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai.',
        'Bước một chân về trước khoảng nửa mét.',
        'Hạ người bằng cách gập gối và hông, giữ lưng thẳng.',
        'Hạ đến khi đùi trước song song sàn.',
        'Đẩy gót chân trước để trở về, rồi đổi chân.',
      ],
      en: [
        'Stand with feet shoulder-width apart.',
        'Step one foot forward about two feet.',
        'Lower your body by bending your knees and hips.',
        'Lower until your front thigh is parallel to the ground.',
        'Push through your front heel to return, then switch legs.',
      ],
    },
    image: '/exercises/images/2368.jpg',
    gif: '/exercises/gifs/2368.gif',
  },
  {
    id: '3013',
    name: { vi: 'Cầu mông (glute bridge)', en: 'Glute bridge' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Đặt hai tay dọc thân, lòng bàn tay úp xuống.',
        'Siết mông và bụng, nâng hông khỏi sàn tạo đường thẳng từ gối đến vai.',
        'Giữ vài giây ở trên, siết chặt mông.',
        'Từ từ hạ hông xuống vị trí ban đầu.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Place your arms by your sides.',
        'Engage your glutes and lift your hips into a straight line.',
        'Hold for a moment at the top, squeezing your glutes.',
        'Slowly lower your hips back down.',
      ],
    },
    image: '/exercises/images/3013.jpg',
    gif: '/exercises/gifs/3013.gif',
  },
  {
    id: '3561',
    name: { vi: 'Cầu mông bước tại chỗ', en: 'Glute bridge march' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Nằm ngửa, gối gập, bàn chân chạm sàn.',
        'Siết mông, nâng hông khỏi sàn.',
        'Giữ hông trên cao, nhấc một chân, đưa gối về phía ngực.',
        'Hạ chân xuống rồi đổi chân còn lại.',
        'Luân phiên hai chân như đang bước đi, giữ hông không hạ xuống.',
      ],
      en: [
        'Lie flat on your back with knees bent, feet flat on the ground.',
        'Engage your glutes and lift your hips off the ground.',
        'While hips stay lifted, bring one knee towards your chest.',
        'Lower that foot, then repeat with the other leg.',
        'Continue alternating legs in a marching motion.',
      ],
    },
    image: '/exercises/images/3561.jpg',
    gif: '/exercises/gifs/3561.gif',
  },
  {
    id: '0459',
    name: { vi: 'Đá chân bơi (flutter kicks)', en: 'Flutter kicks' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Nằm ngửa, chân duỗi thẳng, tay đặt hai bên thân.',
        'Siết bụng, nâng hai chân khỏi sàn khoảng 15cm.',
        'Giữ chân thẳng, luân phiên nâng chân này cao hơn chân kia.',
        'Tiếp tục động tác đá nhẹ liên tục theo số lần mong muốn.',
      ],
      en: [
        'Lie flat on your back with legs extended, hands by your sides.',
        'Engage your core and lift your legs about 6 inches off the ground.',
        'Keeping legs straight, alternate lifting one leg higher than the other.',
        'Continue this fluttering motion for the desired duration.',
      ],
    },
    image: '/exercises/images/0459.jpg',
    gif: '/exercises/gifs/0459.gif',
  },
  {
    id: '1476',
    name: { vi: 'Squat một chân', en: 'One leg squat' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Mông', en: 'Glutes' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai.',
        'Duỗi thẳng một chân về trước, nhấc khỏi sàn.',
        'Gập gối chân trụ, hạ người xuống như đang ngồi ghế.',
        'Đẩy gót chân trụ để trở về vị trí ban đầu.',
        'Đổi chân và lặp lại.',
      ],
      en: [
        'Stand with feet shoulder-width apart.',
        'Extend one leg forward, off the ground.',
        'Bend your standing leg, lowering your body.',
        'Push through your heel to return to standing.',
        'Repeat with the other leg.',
      ],
    },
    image: '/exercises/images/1476.jpg',
    gif: '/exercises/gifs/1476.gif',
  },
  {
    id: '1489',
    name: { vi: 'Squat ngả người', en: 'Sissy squat' },
    bodyPart: { vi: 'Đùi', en: 'Upper legs' },
    target: { vi: 'Đùi trước', en: 'Quads' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai, mũi chân hơi mở ra ngoài.',
        'Vịn vào vật cố định nếu cần giữ thăng bằng.',
        'Từ từ hạ người bằng cách gập gối và ngả người ra sau, giữ thân trên thẳng.',
        'Hạ đến khi đùi song song sàn hoặc thấp nhất có thể thoải mái.',
        'Đẩy gót chân để trở về vị trí ban đầu.',
      ],
      en: [
        'Stand with feet shoulder-width apart, toes slightly outward.',
        'Hold onto a stable object for balance if needed.',
        'Slowly lower your body by bending your knees and leaning back.',
        'Lower until your thighs are parallel to the ground.',
        'Push through your heels to return to standing.',
      ],
    },
    image: '/exercises/images/1489.jpg',
    gif: '/exercises/gifs/1489.gif',
  },
  {
    id: '1373',
    name: { vi: 'Nhón gót (calf raise)', en: 'Standing calf raise' },
    bodyPart: { vi: 'Bắp chân', en: 'Lower legs' },
    target: { vi: 'Bắp chân', en: 'Calves' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng vai, mũi chân hướng thẳng.',
        'Đặt tay lên tường hoặc vật cố định để giữ thăng bằng.',
        'Từ từ nhón gót lên cao, dồn trọng lượng lên mũi chân.',
        'Dừng lại một chút ở trên rồi hạ gót xuống vị trí ban đầu.',
        'Lặp lại theo số lần mong muốn.',
      ],
      en: [
        'Stand with feet shoulder-width apart, toes forward.',
        'Place your hands on a wall for balance.',
        'Slowly raise your heels off the ground.',
        'Pause at the top, then lower back down.',
        'Repeat for the desired number of repetitions.',
      ],
    },
    image: '/exercises/images/1373.jpg',
    gif: '/exercises/gifs/1373.gif',
  },
  {
    id: '1387',
    name: { vi: 'Nhón gót một chân', en: 'One leg calf raise' },
    bodyPart: { vi: 'Bắp chân', en: 'Lower legs' },
    target: { vi: 'Bắp chân', en: 'Calves' },
    steps: {
      vi: [
        'Đứng hai chân rộng bằng hông, tay vịn tường hoặc vật cố định.',
        'Nhấc một chân khỏi sàn, đứng thăng bằng trên chân còn lại.',
        'Từ từ nhón gót lên cao, dồn trọng lượng lên mũi chân.',
        'Dừng lại một chút rồi hạ gót xuống vị trí ban đầu.',
        'Lặp lại rồi đổi chân.',
      ],
      en: [
        'Stand with feet hip-width apart, hand on a wall for balance.',
        'Lift one foot off the ground, balancing on the other.',
        'Slowly raise your heel off the ground.',
        'Pause, then lower back down.',
        'Repeat, then switch legs.',
      ],
    },
    image: '/exercises/images/1387.jpg',
    gif: '/exercises/gifs/1387.gif',
  },
];

/**
 * Chọn "bài tập hôm nay" theo ngày (giờ Việt Nam) — cùng 1 bài cho tất cả
 * người xem trong ngày đó, tự đổi bài mới khi sang ngày (00:00 giờ VN).
 */
export const getExerciseOfTheDay = (): Exercise => {
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  // Hash chuỗi ngày thành số nguyên dương ổn định, rồi lấy modulo độ dài mảng.
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash * 31 + todayStr.charCodeAt(i)) >>> 0;
  }
  return EXERCISES[hash % EXERCISES.length];
};
